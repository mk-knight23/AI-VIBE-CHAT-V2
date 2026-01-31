import { createQuery } from '@tanstack/svelte-query'
import { queryClient } from './queryClient'

export interface Provider {
  id: string
  name: string
  description: string
  type: 'openai' | 'anthropic' | 'google' | 'local' | 'custom'
  models: Model[]
  config?: ProviderConfig
  enabled: boolean
  priority: number
}

export interface Model {
  id: string
  name: string
  description?: string
  maxTokens: number
  supportsStreaming: boolean
  supportsJson: boolean
  cost?: {
    input: number
    output: number
  }
}

export interface ProviderConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  maxConcurrency?: number
  timeout?: number
}

export interface ProvidersResponse {
  providers: Provider[]
  timestamp: number
}

// Fetch providers from API
async function fetchProviders(): Promise<ProvidersResponse> {
  const response = await fetch('/api/providers')

  if (!response.ok) {
    throw new Error(`Failed to fetch providers: ${response.statusText}`)
  }

  return response.json()
}

// Create the useProviders hook
export function useProviders(options?: {
  enabled?: boolean
  refetchInterval?: number
}) {
  return createQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders,
    select: (data: ProvidersResponse) => {
      // Sort providers by priority
      return {
        ...data,
        providers: data.providers.sort((a: Provider, b: Provider) => a.priority - b.priority)
      }
    },
    ...options
  })
}

// Refetch providers
export function refetchProviders() {
  return queryClient.refetchQuery({ queryKey: ['providers'] })
}

// Cache helpers
export function prefetchProviders() {
  return queryClient.prefetchQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders,
  })
}

// Get provider by ID
export function useProvider(id: string) {
  const providersQuery = useProviders()

  return {
    ...providersQuery,
    get provider() {
      return providersQuery.data?.providers.find(p => p.id === id)
    }
  }
}

// Get models for a provider
export function useModels(providerId: string) {
  const providersQuery = useProviders()

  return {
    ...providersQuery,
    get models() {
      const provider = providersQuery.data?.providers.find(p => p.id === providerId)
      return provider?.models || []
    },
    get isLoading() {
      return providersQuery.isLoading || !providersQuery.data
    }
  }
}

// Example: Query for enabled providers only
export function useEnabledProviders() {
  const providersQuery = useProviders()

  return {
    ...providersQuery,
    get enabledProviders() {
      if (!providersQuery.data) return []
      return providersQuery.data.providers.filter(p => p.enabled)
    }
  }
}

// Example: Query for providers with streaming support
export function useStreamingProviders() {
  const providersQuery = useProviders()

  return {
    ...providersQuery,
    get streamingProviders() {
      if (!providersQuery.data) return []
      return providersQuery.data.providers.filter(p =>
        p.enabled && p.models.some(m => m.supportsStreaming)
      )
    }
  }
}