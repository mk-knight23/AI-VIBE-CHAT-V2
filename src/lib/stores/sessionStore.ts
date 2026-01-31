import { writable, derived } from 'svelte/store'

export interface Session {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messageCount: number
  providerId?: string
  modelId?: string
}

export interface SessionState {
  sessions: Session[]
  currentSessionId: string | null
  loading: boolean
  error: string | null
}

// Storage key for localStorage
const STORAGE_KEY = 'ai-vibe-sessions'

function createSessionStore() {
  const initialState: SessionState = {
    sessions: [],
    currentSessionId: null,
    loading: false,
    error: null
  }

  // Load from localStorage on initialization
  function loadFromStorage(): Session[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects if needed
        return parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt).getTime(),
          updatedAt: new Date(session.updatedAt).getTime()
        }))
      }
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error)
    }
    return []
  }

  // Save to localStorage
  function saveToStorage(sessions: Session[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Failed to save sessions to localStorage:', error)
    }
  }

  const { subscribe, set, update } = writable<SessionState>(() => {
    const sessions = loadFromStorage()
    return {
      ...initialState,
      sessions,
      currentSessionId: sessions.length > 0 ? sessions[0].id : null
    }
  })

  // Derivatives
  const currentSession = derived(subscribe, ($state) =>
    $state.sessions.find(s => s.id === $state.currentSessionId) || null
  )

  const isEmpty = derived(subscribe, ($state) => $state.sessions.length === 0)

  // Actions
  function createSession(title?: string): string {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = Date.now()
    const session: Session = {
      id,
      title: title || `Session ${now.toLocaleString()}`,
      createdAt: now,
      updatedAt: now,
      messageCount: 0
    }

    update((state) => {
      const newSessions = [...state.sessions, session]
      saveToStorage(newSessions)
      return {
        ...state,
        sessions: newSessions,
        currentSessionId: id
      }
    })

    return id
  }

  function switchSession(sessionId: string): void {
    update((state) => ({
      ...state,
      currentSessionId: sessionId
    }))
  }

  function updateSession(sessionId: string, updates: Partial<Session>): void {
    update((state) => {
      const newSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, ...updates, updatedAt: Date.now() }
          : session
      )
      saveToStorage(newSessions)
      return { ...state, sessions: newSessions }
    })
  }

  function deleteSession(sessionId: string): void {
    update((state) => {
      const newSessions = state.sessions.filter((session) => session.id !== sessionId)
      saveToStorage(newSessions)
      const newCurrentId =
        state.currentSessionId === sessionId
          ? newSessions.length > 0 ? newSessions[0].id : null
          : state.currentSessionId

      return {
        ...state,
        sessions: newSessions,
        currentSessionId: newCurrentId
      }
    })
  }

  function clearSessions(): void {
    localStorage.removeItem(STORAGE_KEY)
    set(initialState)
  }

  function incrementMessageCount(sessionId: string): void {
    update((state) => {
      const newSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, messageCount: session.messageCount + 1, updatedAt: Date.now() }
          : session
      )
      saveToStorage(newSessions)
      return { ...state, sessions: newSessions }
    })
  }

  function setLoading(isLoading: boolean): void {
    update((state) => ({ ...state, loading: isLoading }))
  }

  function setError(error: string | null): void {
    update((state) => ({ ...state, error }))
  }

  return {
    subscribe,
    set,
    update,
    // Derivatives
    currentSession,
    isEmpty,
    // Actions
    createSession,
    switchSession,
    updateSession,
    deleteSession,
    clearSessions,
    incrementMessageCount,
    setLoading,
    setError
  }
}

export const sessionStore = createSessionStore()
export type { SessionState as SessionStateInterface }