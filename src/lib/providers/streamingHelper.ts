export interface SSEChunk {
  type: string
  [key: string]: any
}

export interface StreamingOptions {
  timeout?: number
  retryCount?: number
  retryDelay?: number
}

export class StreamingHelper {
  static async consumeSSEStream(
    stream: ReadableStream,
    onChunk: (chunk: SSEChunk) => void,
    onError?: (error: Error) => void,
    options: StreamingOptions = {}
  ): Promise<void> {
    const {
      timeout = 30000,
      retryCount = 3,
      retryDelay = 1000
    } = options

    const decoder = new TextDecoder()
    let buffer = ''
    let retry = 0
    let lastError: Error | null = null

    const readStream = async () => {
      try {
        const reader = stream.getReader()
        let reading = true

        while (reading) {
          const { done, value } = await reader.read()

          if (done) {
            reading = false
            break
          }

          buffer += decoder.decode(value, { stream: true })

          // Process complete lines
          while (true) {
            const newlineIndex = buffer.indexOf('\n')
            if (newlineIndex === -1) break

            const line = buffer.slice(0, newlineIndex).trim()
            buffer = buffer.slice(newlineIndex + 1)

            if (line.startsWith('data: ')) {
              const jsonData = line.slice(6)
              if (jsonData === '[DONE]') {
                reading = false
                break
              }

              try {
                const chunk: SSEChunk = JSON.parse(jsonData)
                onChunk(chunk)
              } catch (error) {
                if (onError) {
                  onError(new Error(`Failed to parse SSE chunk: ${jsonData}`))
                }
              }
            }
          }
        }
      } catch (error) {
        if (onError) {
          onError(error as Error)
        }
      }
    }

    // Execute with timeout and retry
    const executeWithRetry = async (): Promise<void> => {
      try {
        await Promise.race([
          readStream(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Streaming timeout')), timeout)
          )
        ])
      } catch (error) {
        if (retry < retryCount) {
          retry++
          await new Promise(resolve => setTimeout(resolve, retryDelay * retry))
          return executeWithRetry()
        }
        throw error
      }
    }

    return executeWithRetry()
  }

  static normalizeError(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message)
    }
    return 'An unknown error occurred'
  }

  static createRetryWrapper<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let lastError: Error

      for (let i = 0; i <= maxRetries; i++) {
        try {
          const result = await fn()
          resolve(result)
          return
        } catch (error) {
          lastError = error as Error
          if (i < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
          }
        }
      }

      reject(lastError)
    })
  }

  static createStreamProcessor<T extends SSEChunk>(
    onChunk: (chunk: T) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ) {
    let buffer = ''
    const decoder = new TextDecoder()

    return {
      processChunk: (value: Uint8Array) => {
        try {
          buffer += decoder.decode(value, { stream: true })

          while (true) {
            const newlineIndex = buffer.indexOf('\n')
            if (newlineIndex === -1) break

            const line = buffer.slice(0, newlineIndex).trim()
            buffer = buffer.slice(newlineIndex + 1)

            if (line.startsWith('data: ')) {
              const jsonData = line.slice(6)
              if (jsonData === '[DONE]') {
                onComplete?.()
                return
              }

              try {
                const chunk: T = JSON.parse(jsonData)
                onChunk(chunk)
              } catch (error) {
                if (onError) {
                  onError(new Error(`Failed to parse chunk: ${jsonData}`))
                }
              }
            }
          }
        } catch (error) {
          if (onError) {
            onError(error as Error)
          }
        }
      },
      flush: () => {
        // Process any remaining data
        if (buffer.trim()) {
          try {
            const jsonData = buffer.trim()
            if (jsonData.startsWith('{')) {
              const chunk: T = JSON.parse(jsonData)
              onChunk(chunk)
            }
          } catch (error) {
            if (onError) {
              onError(new Error(`Failed to parse remaining data: ${buffer}`))
            }
          }
        }
      }
    }
  }
}