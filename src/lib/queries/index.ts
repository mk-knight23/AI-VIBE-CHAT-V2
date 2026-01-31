// TanStack Query utilities
export { queryClient, handleQueryError, handleQuerySuccess, invalidateQueries, prefetchQuery } from './queryClient'

// Provider hooks
export {
  useProviders,
  useProvider,
  useModels,
  useEnabledProviders,
  useStreamingProviders,
  type Provider,
  type Model,
  type ProviderConfig,
  type ProvidersResponse,
  refetchProviders,
  prefetchProviders
} from './useProviders'

// Chat hooks
export {
  useChat,
  useSessionMessages,
  useClearChat,
  useCreateChatSession,
  type ChatMessage,
  type ChatRequest,
  type ChatResponse,
  type SessionMessagesResponse
} from './useChat'