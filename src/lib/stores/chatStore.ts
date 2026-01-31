import { derived, writable, type Writable } from 'svelte/store'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  status?: 'sending' | 'sent' | 'failed'
  metadata?: {
    provider?: string
    model?: string
    tokens?: number
  }
}

export interface ChatState {
  messages: Message[]
  streaming: boolean
  loading: boolean
  error: string | null
  currentSessionId: string | null
}

function createChatStore() {
  const initialState: ChatState = {
    messages: [],
    streaming: false,
    loading: false,
    error: null,
    currentSessionId: null
  }

  const { subscribe, set, update } = writable<ChatState>(initialState)

  // Derivatives
  const isEmpty = derived(subscribe, ($state) => $state.messages.length === 0)
  const lastMessage = derived(subscribe, ($state) =>
    $state.messages[$state.messages.length - 1] || null
  )
  const messagesByRole = derived(subscribe, ($state) => {
    const userMessages = $state.messages.filter(m => m.role === 'user')
    const assistantMessages = $state.messages.filter(m => m.role === 'assistant')
    return { userMessages, assistantMessages }
  })

  // Actions
  function addMessage(message: Omit<Message, 'id' | 'timestamp'>): string {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = Date.now()

    update((state) => ({
      ...state,
      messages: [...state.messages, { ...message, id, timestamp }]
    }))

    return id
  }

  function updateMessage(id: string, updates: Partial<Message>): void {
    update((state) => ({
      ...state,
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    }))
  }

  function removeMessage(id: string): void {
    update((state) => ({
      ...state,
      messages: state.messages.filter((msg) => msg.id !== id)
    }))
  }

  function setStreaming(isStreaming: boolean): void {
    update((state) => ({ ...state, streaming: isStreaming }))
  }

  function setLoading(isLoading: boolean): void {
    update((state) => ({ ...state, loading: isLoading }))
  }

  function setError(error: string | null): void {
    update((state) => ({ ...state, error }))
  }

  function clearMessages(): void {
    update((state) => ({ ...state, messages: [] }))
  }

  function setCurrentSessionId(sessionId: string | null): void {
    update((state) => ({ ...state, currentSessionId: sessionId }))
  }

  function reset(): void {
    set(initialState)
  }

  return {
    subscribe,
    set,
    update,
    // Derivatives
    isEmpty,
    lastMessage,
    messagesByRole,
    // Actions
    addMessage,
    updateMessage,
    removeMessage,
    setStreaming,
    setLoading,
    setError,
    clearMessages,
    setCurrentSessionId,
    reset
  }
}

export const chatStore = createChatStore()
export type { ChatState, Message }