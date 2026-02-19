import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types.js'
import { getProvider, providerRegistry } from '$lib/providers/providerRegistry.js'
import { StreamingHelper } from '$lib/providers/streamingHelper.js'
import { requireAuth } from '$lib/security/auth.js'
import {
  chatRequestSchema,
  isValidProvider,
  isValidModel,
  type ChatRequest
} from '$lib/security/validation.js'

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Require authentication
    requireAuth({ request })

    // Parse request body
    const body = await request.json()

    // Validate request body with Zod schema
    const validatedBody = chatRequestSchema.safeParse(body)
    if (!validatedBody.success) {
      const errors = validatedBody.error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw error(400, `Invalid request: ${errors}`)
    }

    const { messages, model, stream = true, provider: requestedProvider } = validatedBody.data

    // Determine provider - from request parameter or default to 'mock'
    // NEVER parse from user message content (security fix)
    const providerName = requestedProvider || 'mock'

    // Validate provider name against available providers
    const availableProviders = providerRegistry
      .getEnabledProviders()
      .map(entry => entry.metadata.name)

    if (!isValidProvider(providerName, availableProviders)) {
      throw error(400, `Invalid provider: '${providerName}' is not available`)
    }

    // Validate model name against available models for the provider
    const availableModels = providerRegistry.getAvailableModels(providerName)
    if (!isValidModel(model, availableModels)) {
      throw error(400, `Invalid model: '${model}' is not available for provider '${providerName}'`)
    }

    // Get provider adapter
    const provider = getProvider(providerName)
    if (!provider) {
      throw error(404, `Provider '${providerName}' not found`)
    }

    // Build chat request
    const chatRequest: ChatRequest = { messages, model, stream }

    // Check if streaming is requested and supported
    if (stream) {
      // Create SSE stream
      const stream = provider.stream(chatRequest)

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
      const response = await provider.chat(chatRequest)
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
