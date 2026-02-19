import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types.js'
import { getProvidersMetadata } from '$lib/providers/providerRegistry.js'
import { requireAuth } from '$lib/security/auth.js'

export const GET: RequestHandler = async ({ request }) => {
  try {
    // Require authentication
    requireAuth({ request })

    const providers = getProvidersMetadata()

    return json({
      success: true,
      data: providers,
      count: providers.length
    })
  } catch (err) {
    console.error('Providers API error:', err)

    // If it's already an HTTP error, rethrow it
    if (err && typeof err === 'object' && 'status' in err) {
      throw err
    }

    return json(
      {
        success: false,
        error: 'An error occurred while fetching providers'
      },
      { status: 500 }
    )
  }
}
