import { writable, derived } from 'svelte/store'

export interface UIState {
  sidebar: {
    open: boolean
    width: number
  }
  settings: {
    open: boolean
    panel: 'general' | 'providers' | 'appearance' | 'advanced'
  }
  theme: 'light' | 'dark' | 'system'
  keyboardShortcuts: {
    enabled: boolean
    activeShortcut?: string
  }
  modal: {
    open: boolean
    type: 'about' | 'help' | 'settings' | null
    data?: any
  }
}

const DEFAULT_SIDEBAR_WIDTH = 280
const STORAGE_KEY = 'ai-vibe-ui-state'

function createUIStateStore() {
  const initialState: UIState = {
    sidebar: {
      open: true,
      width: DEFAULT_SIDEBAR_WIDTH
    },
    settings: {
      open: false,
      panel: 'general'
    },
    theme: 'system',
    keyboardShortcuts: {
      enabled: true
    },
    modal: {
      open: false,
      type: null
    }
  }

  // Load from localStorage on initialization
  function loadFromStorage(): Partial<UIState> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load UI state from localStorage:', error)
    }
    return {}
  }

  // Save to localStorage
  function saveToStorage(state: UIState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save UI state to localStorage:', error)
    }
  }

  const { subscribe, set, update } = writable<UIState>(() => {
    const saved = loadFromStorage()
    return { ...initialState, ...saved }
  })

  // Derivatives
  const isSidebarOpen = derived(subscribe, ($state: UIState) => $state.sidebar.open)
  const sidebarWidth = derived(subscribe, ($state: UIState) => $state.sidebar.width)
  const isSettingsOpen = derived(subscribe, ($state: UIState) => $state.settings.open)
  const isModalOpen = derived(subscribe, ($state: UIState) => $state.modal.open)
  const effectiveTheme = derived(subscribe, ($state: UIState) => {
    if ($state.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return $state.theme
  })

  // Actions
  function toggleSidebar(): void {
    update((state) => {
      const newState = {
        ...state,
        sidebar: {
          ...state.sidebar,
          open: !state.sidebar.open
        }
      }
      saveToStorage(newState)
      return newState
    })
  }

  function setSidebarOpen(open: boolean): void {
    update((state) => {
      const newState = {
        ...state,
        sidebar: {
          ...state.sidebar,
          open
        }
      }
      saveToStorage(newState)
      return newState
    })
  }

  function setSidebarWidth(width: number): void {
    update((state) => {
      const newState = {
        ...state,
        sidebar: {
          ...state.sidebar,
          width: Math.max(200, Math.min(400, width))
        }
      }
      saveToStorage(newState)
      return newState
    })
  }

  function toggleSettings(): void {
    update((state) => {
      const newState = {
        ...state,
        settings: {
          ...state.settings,
          open: !state.settings.open
        }
      }
      saveToStorage(newState)
      return newState
    })
  }

  function openSettings(panel: UIState['settings']['panel'] = 'general'): void {
    update((state) => {
      const newState = {
        ...state,
        settings: {
          open: true,
          panel
        }
      }
      saveToStorage(newState)
      return newState
    })
  }

  function closeSettings(): void {
    update((state) => {
      const newState = {
        ...state,
        settings: {
          ...state.settings,
          open: false
        }
      }
      saveToStorage(newState)
      return newState
    })
  }

  function setTheme(theme: 'light' | 'dark' | 'system'): void {
    update((state) => {
      const newState = {
        ...state,
        theme
      }
      saveToStorage(newState)
      return newState
    })
  }

  function toggleKeyboardShortcuts(): void {
    update((state) => ({
      ...state,
      keyboardShortcuts: {
        ...state.keyboardShortcuts,
        enabled: !state.keyboardShortcuts.enabled
      }
    }))
  }

  function setActiveShortcut(shortcut: string | undefined): void {
    update((state) => ({
      ...state,
      keyboardShortcuts: {
        ...state.keyboardShortcuts,
        activeShortcut: shortcut
      }
    }))
  }

  function openModal(type: 'about' | 'help' | 'settings', data?: any): void {
    update((state) => ({
      ...state,
      modal: {
        open: true,
        type,
        data
      }
    }))
  }

  function closeModal(): void {
    update((state) => ({
      ...state,
      modal: {
        open: false,
        type: null,
        data: undefined
      }
    }))
  }

  function reset(): void {
    localStorage.removeItem(STORAGE_KEY)
    set(initialState)
  }

  return {
    subscribe,
    set,
    update,
    // Derivatives
    isSidebarOpen,
    sidebarWidth,
    isSettingsOpen,
    isModalOpen,
    effectiveTheme,
    // Actions
    toggleSidebar,
    setSidebarOpen,
    setSidebarWidth,
    toggleSettings,
    openSettings,
    closeSettings,
    setTheme,
    toggleKeyboardShortcuts,
    setActiveShortcut,
    openModal,
    closeModal,
    reset
  }
}

export const uiStateStore = createUIStateStore()
export type { UIState as UIStateInterface }