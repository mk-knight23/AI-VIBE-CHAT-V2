"use client"

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProviderSettings {
  apiKey?: string;
  baseUrl?: string;
}

interface SettingsState {
  selectedProvider: string;
  selectedModel: string;
  providerSettings: Record<string, ProviderSettings>;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setProviderSettings: (provider: string, settings: ProviderSettings) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      selectedProvider: 'openai',
      selectedModel: 'gpt-4o-mini',
      providerSettings: {},
      setProvider: (provider) => set({ selectedProvider: provider }),
      setModel: (model) => set({ selectedModel: model }),
      setProviderSettings: (provider, settings) =>
        set((state) => ({
          providerSettings: { ...state.providerSettings, [provider]: settings }
        }))
    }),
    { name: 'ai-settings' }
  )
);
