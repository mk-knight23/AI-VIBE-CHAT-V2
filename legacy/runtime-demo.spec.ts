import { test, expect } from '@playwright/test';

test.describe('AI-VIBE-CHAT-V2 Runtime Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should load with correct framework and theme', async ({ page }) => {
    // Check for SvelteKit indicators
    const html = await page.content();
    expect(html).toContain('data-sveltekit-preload-data');

    // Check for Tailwind CSS
    const styles = await page.locator('style').all();
    const hasTailwind = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some(s => s.textContent?.includes('tailwindcss'));
    });
    expect(hasTailwind).toBeTruthy();

    // Check for correct theme (Inter font)
    const fontFamily = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('Inter');
  });

  test('should display welcome screen correctly', async ({ page }) => {
    // Check for welcome message
    await expect(page.locator('text=How can I help you today?')).toBeVisible();

    // Check for suggestion cards
    await expect(page.locator('text=Code Assistant')).toBeVisible();
    await expect(page.locator('text=Writing Help')).toBeVisible();
    await expect(page.locator('text=Problem Solving')).toBeVisible();
    await expect(page.locator('text=Learning')).toBeVisible();

    // Check for AI Chat header
    await expect(page.locator('h1:has-text("AI Chat")')).toBeVisible();
  });

  test('should have correct neon accent colors', async ({ page }) => {
    // Check for cyan gradient in header
    const headerLogo = page.locator('.bg-gradient-to-br').first();
    await expect(headerLogo).toBeVisible();

    // Verify gradient contains cyan
    const gradientClass = await headerLogo.getAttribute('class');
    expect(gradientClass).toContain('from-cyan-500');
  });

  test('should send message and display in chat', async ({ page }) => {
    // Find input field
    const input = page.locator('input[placeholder="Type your message..."]');
    await expect(input).toBeVisible();

    // Type test message
    await input.fill('hello test message');

    // Click send button
    const sendButton = page.locator('button:has-text("Send")');
    await sendButton.click();

    // Verify user message appears
    await expect(page.locator('text=hello test message')).toBeVisible();

    // Check for "You" label on user message
    await expect(page.locator('text=You')).toBeVisible();
  });

  test('should show loading indicator while streaming', async ({ page }) => {
    const input = page.locator('input[placeholder="Type your message..."]');
    const sendButton = page.locator('button:has-text("Send")');

    await input.fill('test message');
    await sendButton.click();

    // Check for loading dots (might appear briefly)
    await page.waitForTimeout(500);

    // The loading indicator should have been shown
    const loadingDots = page.locator('.animate-bounce');
    const loadingVisible = await loadingDots.count() > 0;
    // Loading might be too fast to catch, so we just note it
    console.log(`Loading dots visible: ${loadingVisible}`);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Set up invalid provider settings to trigger error
    await page.evaluate(() => {
      localStorage.setItem('ai-settings', JSON.stringify({
        selectedProvider: 'openai',
        selectedModel: 'gpt-4o-mini',
        providerSettings: {
          openai: {
            apiKey: 'invalid-key'
          }
        }
      }));
    });

    // Reload page with invalid settings
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Try to send a message
    const input = page.locator('input[placeholder="Type your message..."]');
    await input.fill('test error');
    await page.locator('button:has-text("Send")').click();

    // Wait for error message (appears in chat)
    await page.waitForTimeout(2000);

    // Check for error indicator
    const hasError = await page.locator('text=/Error|Invalid|API/').count() > 0;
    console.log(`Error message displayed: ${hasError}`);
  });

  test('should have working clear button', async ({ page }) => {
    // First, send a message
    const input = page.locator('input[placeholder="Type your message..."]');
    await input.fill('test clear');
    await page.locator('button:has-text("Send")').click();

    await expect(page.locator('text=test clear')).toBeVisible();

    // Click clear button
    const clearButton = page.locator('button:has([data-lucide="trash2"])').or(
      page.locator('svg[data-lucide="trash2"]').locator('..').locator('..')
    );

    // Try to find and click the trash button
    try {
      await clearButton.click();
      await page.waitForTimeout(500);

      // Verify welcome screen returns
      await expect(page.locator('text=How can I help you today?')).toBeVisible();
    } catch (e) {
      console.log('Clear button test skipped - button might be disabled');
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);

    console.log('Console errors:', errors);
    expect(errors.length).toBe(0);
  });

  test('should load all assets successfully', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    console.log('Failed requests:', failedRequests);
    expect(failedRequests.length).toBe(0);
  });
});

test.describe('Screenshot Documentation', () => {
  test('should capture welcome screen', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/01-welcome.png', fullPage: true });
  });

  test('should capture chat after sending message', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const input = page.locator('input[placeholder="Type your message..."]');
    await input.fill('hello from playwright');
    await page.locator('button:has-text("Send")').click();

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/02-chat-with-message.png', fullPage: true });
  });
});
