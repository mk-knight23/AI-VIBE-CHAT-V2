import { createQuery, createMutation } from '@tanstack/svelte-query'
import { queryClient } from './queryClient'
import { chatStore } from '../stores/chatStore'
import { errorStore } from '../stores/errorStore'
import { sessionStore } from '../stores/sessionStore'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  providerId?: string
  modelId?: string
  tokens?: number
  metadata?: any
}

export interface ChatRequest {
  message: string
  sessionId?: string
  providerId?: string
  modelId?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  systemPrompt?: string
}

export interface ChatResponse {
  messageId: string
  content: string
  role: 'assistant'
  timestamp: number
  providerId?: string
  modelId?: string
  tokens?: number
  done: boolean
  metadata?: any
}

export interface SessionMessagesResponse {
  sessionId: string
  messages: ChatMessage[]
  total: number
}

// Fetch chat history for a session
async function fetchSessionMessages(sessionId: string): Promise<SessionMessagesResponse> {
  const response = await fetch(`/api/chat/sessions/${sessionId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch session messages: ${response.statusText}`)
  }

  return response.json()
}

// Create the useSessionMessages hook
export function useSessionMessages(sessionId: string) {
  return createQuery(() => ({
    queryKey: ['chat', 'sessions', sessionId, 'messages'],
    queryFn: () => fetchSessionMessages(sessionId),
    enabled: !!sessionId,
    select: (data) => ({
      ...data,
      messages: data.messages.sort((a, b) => a.timestamp - b.timestamp)
    })
  }))
}

// Send a chat message
async function sendChatMessage(request: ChatRequest & { stream?: boolean }): Promise<Response> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`)
  }

  return response
}

// Create the useChat hook
export function useChat(options?: {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  onStreamStart?: () => void
  onStreamEnd?: () => void
}) {
  const mutation = createMutation(() => ({
    mutationFn: sendChatMessage,
    onSuccess: (data, variables) => {
      // Update session message count
      if (variables.sessionId) {
        sessionStore.incrementMessageCount(variables.sessionId)
      }

      // Trigger refetch of session messages
      if (variables.sessionId) {
        queryClient.invalidateQueries({ queryKey: ['chat', 'sessions', variables.sessionId, 'messages'] })
      }

      // Call onSuccess callback
      if (options?.onSuccess) {
        options.onSuccess(data)
      }
    },
    onError: (error, variables) => {
      errorStore.setNetworkError(error.message)
      if (options?.onError) {
        options.onError(error)
      }
    }
  }))

  // Stream a message
  async function streamMessage(request: ChatRequest) {
    const { onStreamStart, onStreamEnd } = options || {}

    try {
      chatStore.setStreaming(true)
      chatStore.setLoading(false)
      onStreamStart?.()

      const response = await mutation.mutateAsync({ ...request, stream: true })

      if (!response.body) {
        throw new Error('No response body for streaming')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let messageId: string | null = null

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process complete JSON objects from buffer
          while (true) {
            const newlineIndex = buffer.indexOf('\n')
            if (newlineIndex === -1) break

            const line = buffer.slice(0, newlineIndex)
            buffer = buffer.slice(newlineIndex + 1)

            if (line.trim()) {
              try {
                const data = JSON.parse(line)

                // Initialize messageId if not set
                if (!messageId && data.messageId) {
                  messageId = data.messageId
                }

                // Update the streaming message
                if (messageId) {
                  chatStore.updateMessage(messageId, {
                    content: data.content || '',
                    role: 'assistant',
                    status: data.done ? 'sent' : 'sending'
                  })
                }

                if (data.done) {
                  break
                }
              } catch (e) {
                // Skip malformed JSON
                console.warn('Failed to parse JSON line:', line)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      onStreamEnd?.()
    } catch (error) {
      if (error instanceof Error) {
        errorStore.setNetworkError(error.message)
      }
    } finally {
      chatStore.setStreaming(false)
      chatStore.setLoading(false)
    }
  }

  // Send a non-streaming message
  async function sendMessage(request: ChatRequest) {
    try {
      chatStore.setLoading(true)

      const response = await mutation.mutateAsync({ ...request, stream: false })

      // Add the message to the store
      if (response.ok) {
        const data = await response.json()
        if (data.messageId) {
          chatStore.updateMessage(data.messageId, {
            content: data.content,
            role: 'assistant',
            status: 'sent'
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        errorStore.setNetworkError(error.message)
      }
    } finally {
      chatStore.setLoading(false)
    }
  }

  return {
    ...mutation,
    // Helper methods
    streamMessage,
    sendMessage,
    isStreaming: chatStore.streaming,
    isLoading: mutation.isPending
  }
}

// Clear chat session
export function useClearChat() {
  return createMutation(() => ({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to clear chat: ${response.statusText}`)
      }

      return response.json()
    },
    onSuccess: (_, sessionId) => {
      // Clear local state
      chatStore.clearMessages()
      chatStore.setCurrentSessionId(sessionId)

      // Invalidate query
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions', sessionId, 'messages'] })
    }
  }))
}

// Create a new chat session
export function useCreateChatSession() {
  return createMutation(() => ({
    mutationFn: async (title?: string) => {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`)
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Update session store
      sessionStore.createSession(data.title)
    }
  }))
}