import { QueryClient } from '@tanstack/svelte-query'

// Create query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default query options
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('401')) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      // Default mutation options
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('401')) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

// Error handling for query client
export const handleQueryError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Query error:', error.message)
    // You can integrate with your error store here
  }
}

// Success handling for query client
export const handleQuerySuccess = (data: any) => {
  console.log('Query success:', data)
  // You can add global success handling here
}

// Invalidate queries helper
export const invalidateQueries = (queryKey?: string[]) => {
  return queryClient.invalidateQueries({ queryKey })
}

// Prefetch queries helper
export const prefetchQuery = (queryKey: string[]) => {
  return queryClient.prefetchQuery({ queryKey })
}