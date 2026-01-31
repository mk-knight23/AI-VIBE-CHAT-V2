import { derived, writable, type Writable } from 'svelte/store'

export interface ErrorState {
  message: string | null
  type: 'network' | 'validation' | 'auth' | 'server' | 'unknown' | null
  code?: string | null
  timestamp: number | null
  details?: any
}

export interface ErrorStore {
  subscribe: Writable<ErrorState>['subscribe']
  setError: (error: string, type?: ErrorState['type'], code?: string, details?: any) => void
  clearError: () => void
  hasError: boolean
  errorMessage: string | null
}

function createErrorStore() {
  const initialState: ErrorState = {
    message: null,
    type: null,
    code: null,
    timestamp: null,
    details: null
  }

  const { subscribe, set, update } = writable<ErrorState>(initialState)

  // Derivatives
  const hasError = derived(subscribe, ($state) => $state.message !== null)
  const errorMessage = derived(subscribe, ($state) => $state.message)

  // Actions
  function setError(
    error: string,
    type: ErrorState['type'] = 'unknown',
    code?: string,
    details?: any
  ): void {
    const timestamp = Date.now()
    update((state) => ({
      ...state,
      message: error,
      type,
      code,
      timestamp,
      details
    }))

    // Auto-clear after 30 seconds for non-critical errors
    if (type !== 'auth' && type !== 'validation') {
      setTimeout(() => {
        clearError()
      }, 30000)
    }
  }

  function clearError(): void {
    set(initialState)
  }

  function setNetworkError(error: string, details?: any): void {
    setError(error, 'network', undefined, details)
  }

  function setValidationError(error: string, details?: any): void {
    setError(error, 'validation', undefined, details)
  }

  function setAuthError(error: string, code?: string): void {
    setError(error, 'auth', code)
  }

  function setServerError(error: string, code?: string, details?: any): void {
    setError(error, 'server', code, details)
  }

  function setUnknownError(error: string, details?: any): void {
    setError(error, 'unknown', undefined, details)
  }

  // Helper to create error objects
  function createError(
    message: string,
    type: ErrorState['type'] = 'unknown',
    code?: string,
    details?: any
  ): ErrorState {
    return {
      message,
      type,
      code,
      timestamp: Date.now(),
      details
    }
  }

  // Handle promise rejections
  function handlePromiseRejection(error: unknown): void {
    if (error instanceof Error) {
      setUnknownError(error.message)
    } else {
      setUnknownError('An unknown error occurred')
    }
  }

  // Handle fetch errors
  function handleFetchError(response: Response, url?: string): void {
    if (response.status === 401) {
      setAuthError('Authentication failed. Please check your credentials.')
    } else if (response.status === 403) {
      setAuthError('Access denied. You do not have permission to access this resource.')
    } else if (response.status >= 500) {
      setServerError(`Server error: ${response.statusText}`)
    } else if (response.status >= 400) {
      setValidationError(`Request failed: ${response.statusText}`)
    } else {
      setNetworkError(`Network error: ${response.statusText}`)
    }
  }

  return {
    subscribe,
    set,
    update,
    // Derivatives
    hasError,
    errorMessage,
    // Actions
    setError,
    clearError,
    setNetworkError,
    setValidationError,
    setAuthError,
    setServerError,
    setUnknownError,
    createError,
    handlePromiseRejection,
    handleFetchError
  }
}

export const errorStore = createErrorStore()
export type { ErrorState }