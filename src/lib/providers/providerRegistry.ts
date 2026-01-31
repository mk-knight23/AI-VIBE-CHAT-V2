import type { ProviderAdapter, ProviderMetadata } from './types.js'
import { mockProvider } from './mockProvider.js'

export interface ProviderEntry {
  adapter: ProviderAdapter
  metadata: ProviderMetadata
  enabled: boolean
}

class ProviderRegistry {
  private providers: Map<string, ProviderEntry> = new Map()

  constructor() {
    // Register mock provider
    this.register('mock', {
      name: 'mock',
      description: 'Mock provider for testing and development',
      baseUrl: 'https://api.mock.com',
      models: ['mock-model-1', 'mock-model-2'],
      features: {
        streaming: true,
        vision: false,
        tools: false
      }
    }, mockProvider, true)
  }

  register(
    name: string,
    metadata: ProviderMetadata,
    adapter: ProviderAdapter,
    enabled: boolean = true
  ): void {
    this.providers.set(name, {
      metadata,
      adapter,
      enabled
    })
  }

  getProvider(name: string): ProviderAdapter | null {
    const entry = this.providers.get(name)
    return entry && entry.enabled ? entry.adapter : null
  }

  getEnabledProviders(): ProviderEntry[] {
    return Array.from(this.providers.values()).filter(entry => entry.enabled)
  }

  getAllProviders(): ProviderEntry[] {
    return Array.from(this.providers.values())
  }

  getProviderMetadata(name: string): ProviderMetadata | null {
    const entry = this.providers.get(name)
    return entry ? entry.metadata : null
  }

  getAvailableModels(providerName?: string): string[] {
    if (providerName) {
      const provider = this.getProvider(providerName)
      if (provider) {
        const metadata = this.getProviderMetadata(providerName)
        return metadata?.models || []
      }
      return []
    }

    // Return all unique models from all enabled providers
    const models = new Set<string>()
    for (const entry of this.providers.values()) {
      if (entry.enabled && entry.metadata.models) {
        entry.metadata.models.forEach(model => models.add(model))
      }
    }
    return Array.from(models)
  }

  enableProvider(name: string): boolean {
    const entry = this.providers.get(name)
    if (entry) {
      entry.enabled = true
      return true
    }
    return false
  }

  disableProvider(name: string): boolean {
    const entry = this.providers.get(name)
    if (entry) {
      entry.enabled = false
      return true
    }
    return false
  }

  hasProvider(name: string): boolean {
    return this.providers.has(name)
  }
}

// Export singleton instance
export const providerRegistry = new ProviderRegistry()

// Export convenience function to get provider
export function getProvider(name: string): ProviderAdapter | null {
  return providerRegistry.getProvider(name)
}

// Export convenience function to get all provider metadata
export function getProvidersMetadata(): ProviderMetadata[] {
  return providerRegistry.getEnabledProviders().map(entry => entry.metadata)
}