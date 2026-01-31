import type { ChatMessage, ProviderConfig } from './types';

export class ProviderClient {
  constructor(
    private providerId: string,
    private baseUrl: string,
    private config: ProviderConfig
  ) {}

  async *streamChat(model: string, messages: ChatMessage[]): AsyncGenerator<string> {
    const { apiKey, baseUrl: customBaseUrl } = this.config;
    const url = customBaseUrl || this.baseUrl;

    if (this.providerId === 'ollama') {
      yield* this.streamOllama(url, model, messages);
    } else if (this.providerId === 'google') {
      yield* this.streamGoogle(url, model, messages, apiKey!);
    } else if (this.providerId === 'anthropic') {
      yield* this.streamAnthropic(url, model, messages, apiKey!);
    } else if (this.providerId === 'huggingface') {
      yield* this.streamHuggingFace(url, model, messages, apiKey!);
    } else if (this.providerId === 'minimax') {
      yield* this.streamMiniMax(url, model, messages, apiKey!);
    } else if (this.providerId === 'moonshot') {
      yield* this.streamOpenAI(url, model, messages, apiKey!);
    } else if (this.providerId === 'xai') {
      yield* this.streamOpenAI(url, model, messages, apiKey!);
    } else {
      yield* this.streamOpenAI(url, model, messages, apiKey!);
    }
  }

  private async *streamOpenAI(url: string, model: string, messages: ChatMessage[], apiKey: string): AsyncGenerator<string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authorization based on provider
    if (this.providerId === 'megallm' || this.providerId === 'agentrouter') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (this.providerId === 'openrouter') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://chatgpt-clone.vercel.app';
      headers['X-Title'] = 'Multi-Provider AI Chat';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${url}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        model, 
        messages: messages.filter(m => m.role !== 'system' || m.content), 
        stream: true, 
        temperature: 0.7, 
        max_tokens: 2000 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) yield content;
          } catch {}
        }
      }
    }
  }

  private async *streamOllama(url: string, model: string, messages: ChatMessage[]): AsyncGenerator<string> {
    const response = await fetch(`${url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true })
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) yield parsed.message.content;
        } catch {}
      }
    }
  }

  private async *streamGoogle(url: string, model: string, messages: ChatMessage[], apiKey: string): AsyncGenerator<string> {
    const contents = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`${url}/models/${model}:streamGenerateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) throw new Error(`Google error: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch {}
      }
    }
  }

  private async *streamAnthropic(url: string, model: string, messages: ChatMessage[], apiKey: string): AsyncGenerator<string> {
    const response = await fetch(`${url}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: messages.filter(m => m.role !== 'system'),
        system: messages.find(m => m.role === 'system')?.content,
        max_tokens: 2000,
        stream: true
      })
    });

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta') {
              yield parsed.delta?.text || '';
            }
          } catch {}
        }
      }
    }
  }

  private async *streamHuggingFace(url: string, model: string, messages: ChatMessage[], apiKey: string): AsyncGenerator<string> {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const response = await fetch(`${url}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 2000, temperature: 0.7 },
        stream: true
      })
    });

    if (!response.ok) throw new Error(`HuggingFace error: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      try {
        const parsed = JSON.parse(text);
        if (parsed.generated_text) yield parsed.generated_text;
        else if (parsed.token?.text) yield parsed.token.text;
      } catch {
        yield text;
      }
    }
  }

  private async *streamMiniMax(url: string, model: string, messages: ChatMessage[], apiKey: string): AsyncGenerator<string> {
    const response = await fetch(`${url}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: messages.filter(m => m.role !== 'system' || m.content),
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error(`MiniMax error: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) yield content;
          } catch {}
        }
      }
    }
  }
}
