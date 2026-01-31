import { test, expect } from '@playwright/test'

test.describe('AI VIBE Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page renders with welcome message', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/AI VIBE Chat/)

    // Check welcome state
    await expect(page.getByText('Welcome to AI VIBE Chat')).toBeVisible()
    await expect(page.getByText('Start a conversation by typing a message below')).toBeVisible()
  })

  test('can send a message and receive response', async ({ page }) => {
    // Type a message
    const input = page.getByPlaceholder('Type your message...')
    await input.fill('Hello, how are you?')

    // Send the message
    const sendButton = page.getByRole('button', { name: 'Send' })
    await sendButton.click()

    // Verify user message appears
    await expect(page.getByText('Hello, how are you?')).toBeVisible()

    // Wait for and verify AI response (mock provider responds with variations of default message)
    await expect(page.getByText(/This is a mock response|I can help you|Hello!/)).toBeVisible({ timeout: 10000 })
  })

  test('clear chat button works', async ({ page }) => {
    // Send a message first
    const input = page.getByPlaceholder('Type your message...')
    await input.fill('Test message')
    await page.getByRole('button', { name: 'Send' }).click()

    // Wait for response
    await expect(page.getByText('Test message')).toBeVisible()

    // Clear chat
    await page.getByRole('button', { name: 'Clear Chat' }).click()

    // Verify welcome state returns
    await expect(page.getByText('Welcome to AI VIBE Chat')).toBeVisible()
  })

  test('handles multiple messages in conversation', async ({ page }) => {
    // Send first message
    await page.getByPlaceholder('Type your message...').fill('First message')
    await page.getByRole('button', { name: 'Send' }).click()

    // Wait for first response
    await expect(page.getByText('First message')).toBeVisible()

    // Send second message
    await page.getByPlaceholder('Type your message...').fill('Second message')
    await page.getByRole('button', { name: 'Send' }).click()

    // Verify both messages are visible
    await expect(page.getByText('First message')).toBeVisible()
    await expect(page.getByText('Second message')).toBeVisible()
  })
})
