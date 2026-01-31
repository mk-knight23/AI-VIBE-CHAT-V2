import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types.js'
import { getProvider } from '$lib/providers/providerRegistry.js'
import { StreamingHelper } from '$lib/providers/streamingHelper.js'
import type { ChatRequest } from '$lib/providers/types.js'

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json() as ChatRequest
    const { messages, model, stream = true } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw error(400, 'Messages array is required and cannot be empty')
    }

    if (!model) {
      throw error(400, 'Model parameter is required')
    }

    // Get provider name from the first message (or use default)
    const systemMessage = messages.find(msg => msg.role === 'system')
    const providerName = systemMessage?.content.match(/provider[:\s]+(\w+)/i)?.[1] || 'mock'

    // Get provider adapter
    const provider = getProvider(providerName)
    if (!provider) {
      throw error(404, `Provider '${providerName}' not found`)
    }

    // Check if streaming is requested and supported
    if (stream) {
      // Create SSE stream
      const stream = provider.stream(body)

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              const encoder = new TextEncoder()

              // Setup SSE stream processor
              const processor = StreamingHelper.createStreamProcessor(
                (chunk) => {
                  // Send chunk to client
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
                },
                () => {
                  // Send completion
                  const done = { type: 'done' }
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(done)}\n\n`))
                  controller.close()
                },
                (error) => {
                  // Send error
                  const errorData = { type: 'error', error: error.message }
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`))
                  controller.close()
                }
              )

              // Process the stream
              const reader = stream.getReader()
              let reading = true

              while (reading) {
                const { done, value } = await reader.read()
                if (done) {
                  reading = false
                  processor.flush()
                  break
                }
                processor.processChunk(value)
              }
            } catch (error) {
              const encoder = new TextEncoder()
              const errorData = {
                type: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`))
              controller.close()
            }
          }
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        }
      )
    } else {
      // Non-streaming response
      const response = await provider.chat(body)
      return json(response)
    }
  } catch (error) {
    console.error('Chat API error:', error)
    if (error instanceof Error && (error as any).status) {
      throw error
    }
    throw error(500, 'Internal server error')
  }
}