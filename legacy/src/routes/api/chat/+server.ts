import { json } from '@sveltejs/kit';
import { ProviderClient } from '$lib/providers/client';
import { getProvider } from '$lib/providers/registry';

export async function POST({ request }: { request: Request }) {
  try {
    const { messages, provider: providerId, model, config } = await request.json();

    const provider = getProvider(providerId);
    if (!provider) {
      return json({ error: 'Provider not found' }, { status: 400 });
    }

    if (provider.requiresApiKey && !config?.apiKey) {
      return json({ error: 'API key required' }, { status: 401 });
    }

    const systemMessage = { role: 'system' as const, content: 'You are a helpful AI assistant.' };
    const allMessages = [systemMessage, ...messages];

    const client = new ProviderClient(providerId, provider.baseUrl || '', config);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of client.streamChat(model, allMessages)) {
            const data = { choices: [{ delta: { content: chunk } }] };
            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          }
          controller.enqueue('data: [DONE]\n\n');
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);

          let errorMsg = 'Unknown error occurred';
          if (error instanceof Error) {
            errorMsg = error.message;

            if (errorMsg.includes('401')) {
              errorMsg = 'Invalid API key. Please check your API key in Settings.';
            } else if (errorMsg.includes('402')) {
              errorMsg = 'Payment required. Your API key may need credits or a valid payment method.';
            } else if (errorMsg.includes('429')) {
              errorMsg = 'Rate limit exceeded. Please wait and try again.';
            } else if (errorMsg.includes('500')) {
              errorMsg = 'Provider service error. Please try again later.';
            }
          }

          const data = { choices: [{ delta: { content: `❌ Error: ${errorMsg}` } }] };
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          controller.enqueue('data: [DONE]\n\n');
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return json({ error: 'Internal error' }, { status: 500 });
  }
};
