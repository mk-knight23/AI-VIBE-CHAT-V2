import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types.js'
import { getProvidersMetadata } from '$lib/providers/providerRegistry.js'

export const GET: RequestHandler = async () => {
  try {
    const providers = getProvidersMetadata()

    return json({
      success: true,
      data: providers,
      count: providers.length
    })
  } catch (error) {
    console.error('Providers API error:', error)
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}