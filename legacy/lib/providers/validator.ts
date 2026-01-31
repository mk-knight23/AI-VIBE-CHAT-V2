import { getProvider } from './registry';

export async function validateApiKey(providerId: string, apiKey: string, baseUrl?: string): Promise<{ valid: boolean; error?: string }> {
  const provider = getProvider(providerId);
  if (!provider) return { valid: false, error: 'Provider not found' };

  if (!provider.requiresApiKey) return { valid: true };
  if (!apiKey) return { valid: false, error: 'API key required' };

  try {
    const url = baseUrl || provider.baseUrl;
    const testModel = provider.models[0]?.id;

    if (providerId === 'ollama' || providerId === 'lmstudio') {
      const response = await fetch(`${url}/api/tags`, { method: 'GET' });
      return { valid: response.ok };
    }

    if (providerId === 'google') {
      const response = await fetch(`${url}/models?key=${apiKey}`, { method: 'GET' });
      return { valid: response.ok, error: response.ok ? undefined : 'Invalid API key' };
    }

    if (providerId === 'anthropic') {
      const response = await fetch(`${url}/messages`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: testModel, messages: [{ role: 'user', content: 'test' }], max_tokens: 1 })
      });
      return { valid: response.status !== 401, error: response.status === 401 ? 'Invalid API key' : undefined };
    }

    // OpenAI-compatible format (most providers)
    const response = await fetch(`${url}/models`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    if (response.ok) return { valid: true };
    if (response.status === 401) return { valid: false, error: 'Invalid API key' };
    return { valid: false, error: `Error: ${response.status}` };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Connection failed' };
  }
}
