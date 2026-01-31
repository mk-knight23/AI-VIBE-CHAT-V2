import { writable, get } from 'svelte/store';

interface ProviderSettings {
  apiKey?: string;
  baseUrl?: string;
}

interface SettingsState {
  selectedProvider: string;
  selectedModel: string;
  providerSettings: Record<string, ProviderSettings>;
}

const DEFAULTS: SettingsState = {
  selectedProvider: 'openai',
  selectedModel: 'gpt-4o-mini',
  providerSettings: {}
};

// Load from localStorage
const loadFromStorage = (): SettingsState => {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const stored = localStorage.getItem('ai-settings');
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

// Save to localStorage
const saveToStorage = (state: SettingsState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ai-settings', JSON.stringify(state));
  }
};

function createSettingsStore() {
  const { subscribe, set, update } = writable<SettingsState>(loadFromStorage());

  return {
    subscribe,
    setProvider: (provider: string) =>
      update(state => {
        const newState = { ...state, selectedProvider: provider };
        saveToStorage(newState);
        return newState;
      }),
    setModel: (model: string) =>
      update(state => {
        const newState = { ...state, selectedModel: model };
        saveToStorage(newState);
        return newState;
      }),
    setProviderSettings: (provider: string, settings: ProviderSettings) =>
      update(state => {
        const newState = {
          ...state,
          providerSettings: { ...state.providerSettings, [provider]: settings }
        };
        saveToStorage(newState);
        return newState;
      }),
    getSettings: (provider: string) => {
      const state = get(settingsStore);
      return state.providerSettings[provider] || {};
    }
  };
}

export const settingsStore = createSettingsStore();
