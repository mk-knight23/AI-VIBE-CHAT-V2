import type { ProviderAdapter, ChatRequest, ChatResponse, ProviderMetadata } from './types.js'

export class MockProvider implements ProviderAdapter {
  name = 'mock'
  baseUrl = 'https://api.mock.com'

  private mockResponses: Record<string, string> = {
    'default': 'This is a mock response from the AI provider.',
    'help': 'I can help you with various questions and tasks. What would you like to know?',
    'weather': 'The weather seems nice today. Perfect for outdoor activities!',
    'coding': 'I can help you with programming questions, debugging, and code reviews.',
    'hello': 'Hello! I am your AI assistant. How can I help you today?'
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

    // Get the last message content to determine mock response
    const lastMessage = request.messages[request.messages.length - 1]?.content.toLowerCase() || 'default'

    // Find the best matching response
    let responseText = this.mockResponses.default
    for (const [key, response] of Object.entries(this.mockResponses)) {
      if (lastMessage.includes(key)) {
        responseText = response
        break
      }
    }

    // Add some variation to make it feel more realistic
    const variations = [
      responseText,
      `I think you're asking about: ${responseText}`,
      `Here's my thoughts on that: ${responseText}`,
      `Interesting question! ${responseText}`,
    ]
    const finalResponse = variations[Math.floor(Math.random() * variations.length)]

    return {
      content: finalResponse,
      model: request.model,
      tokens: Math.floor(Math.random() * 100) + 50
    }
  }

  stream(request: ChatRequest): ReadableStream {
    const encoder = new TextEncoder()
    const lastMessage = request.messages[request.messages.length - 1]?.content.toLowerCase() || 'default'
    let responseText = this.mockResponses.default

    for (const [key, response] of Object.entries(this.mockResponses)) {
      if (lastMessage.includes(key)) {
        responseText = response
        break
      }
    }

    // Add some variation
    const variations = [
      responseText,
      `I think you're asking about: ${responseText}`,
      `Here's my thoughts on that: ${responseText}`,
      `Interesting question! ${responseText}`,
    ]
    const finalResponse = variations[Math.floor(Math.random() * variations.length)]

    return new ReadableStream({
      async start(controller) {
        // Send initial data
        const initialData = {
          type: 'message_start',
          model: request.model,
          created: Date.now()
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`))

        // Stream the response character by character
        for (let i = 0; i < finalResponse.length; i++) {
          const chunk = finalResponse[i]
          const data = {
            type: 'content_block_delta',
            text: chunk
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n`))

          // Simulate typing delay
          await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30))
        }

        // Send final message
        const finalData = {
          type: 'message_delta',
          usage: {
            prompt_tokens: 10,
            completion_tokens: finalResponse.length,
            total_tokens: 10 + finalResponse.length
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalData)}\n\n`))

        // Send done event
        const doneData = {
          type: 'message_stop'
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(doneData)}\n\n`))

        controller.close()
      }
    })
  }

  async validateKey(key: string): Promise<boolean> {
    // Mock validation - any non-empty key is valid
    return key.length > 0
  }
}

// Create a single instance
export const mockProvider = new MockProvider()