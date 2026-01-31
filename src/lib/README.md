# AI-VIBE-CHAT-V2 State Architecture

## Overview

This project uses a hybrid state management architecture combining:
- **Svelte 5 Stores** for UI state management (local state, derived state, effects)
- **TanStack Query** for server state management (caching, mutations, queries)

## Architecture Pattern

```
User Input
    ↓
Svelte Component ($state)
    ↓
TanStack Query Mutation
    ↓
SvelteKit API Route
    ↓
Provider Stream
    ↑
Svelte Store Update
    ↑
UI Reactive Update ($state)
```

## Store Architecture

### 1. Chat Store (`src/lib/stores/chatStore.ts`)

**Purpose**: Manages all chat-related state including messages, streaming, and loading states.

**Key Features**:
- Message lifecycle management (add, update, remove)
- Streaming state tracking
- Error handling for chat operations
- Current session tracking

**Usage**:
```typescript
import { chatStore } from '$lib/stores'

// Subscribe to messages
chatStore.subscribe($state => {
  console.log('Messages:', $state.messages)
})

// Add a message
const messageId = chatStore.addMessage({
  content: 'Hello, world!',
  role: 'user'
})

// Update message status
chatStore.updateMessage(messageId, { status: 'sending' })
```

### 2. Session Store (`src/lib/stores/sessionStore.ts`)

**Purpose**: Manages multiple chat sessions with persistence.

**Key Features**:
- Session CRUD operations
- localStorage persistence
- Current session tracking
- Message count tracking

**Usage**:
```typescript
import { sessionStore } from '$lib/stores'

// Create new session
const sessionId = sessionStore.createSession('New Chat')

// Switch sessions
sessionStore.switchSession(sessionId)

// Update session metadata
sessionStore.updateSession(sessionId, {
  title: 'Updated Title'
})
```

### 3. UI State Store (`src/lib/stores/uiStateStore.ts`)

**Purpose**: Manages global UI state like sidebar, settings, and theme.

**Key Features**:
- Sidebar state (open/closed, width)
- Settings panel state
- Theme management
- Modal state

**Usage**:
```typescript
import { uiStateStore } from '$lib/stores'

// Toggle sidebar
uiStateStore.toggleSidebar()

// Open settings panel
uiStateStore.openSettings('providers')

// Change theme
uiStateStore.setTheme('dark')
```

### 4. Error Store (`src/lib/stores/errorStore.ts`)

**Purpose**: Centralized error handling with type-specific error states.

**Key Features**:
- Error categorization (network, validation, auth, server)
- Auto-clear mechanism for non-critical errors
- Helper methods for common error types

**Usage**:
```typescript
import { errorStore } from '$lib/stores'

// Set error
errorStore.setNetworkError('Failed to connect to server')

// Check for errors
if (errorStore.hasError) {
  console.error(errorStore.errorMessage)
}

// Clear error
errorStore.clearError()
```

## TanStack Query Integration

### 1. Query Client (`src/lib/queries/queryClient.ts`)

**Purpose**: Centralized TanStack Query configuration with global settings.

**Features**:
- Default retry logic
- Error handling integration
- Cache management
- Prefetch/invalidation helpers

### 2. Providers Query (`src/lib/queries/useProviders.ts`)

**Purpose**: Fetches and manages AI provider configurations.

**Features**:
- Provider list caching
- Model filtering by capabilities
- Priority-based sorting
- Real-time updates

**Usage**:
```typescript
import { useProviders, useProvider } from '$lib/queries'

// Get all providers
const { data: providers, isLoading } = useProviders()

// Get specific provider
const { data: provider } = useProvider('openai')
```

### 3. Chat Query (`src/lib/queries/useChat.ts`)

**Purpose**: Handles chat mutations with streaming support.

**Features**:
- Streaming message sending
- Session history fetching
- Error handling integration
- Real-time updates

**Usage**:
```typescript
import { useChat, useSessionMessages } from '$lib/queries'

// Send a message
const { streamMessage, sendMessage } = useChat()

// Stream response
await streamMessage({
  message: 'Hello',
  sessionId: 'current-session',
  providerId: 'openai',
  modelId: 'gpt-4'
})

// Get session messages
const { data: messages } = useSessionMessages('session-id')
```

## Best Practices

### 1. Store Usage

- Use Svelte stores for UI state that needs reactivity
- Use TanStack Query for server state with caching
- Keep stores focused and single-purpose
- Use derived stores for computed values

### 2. Component Integration

```svelte
<script>
  import { chatStore } from '$lib/stores'
  import { useChat } from '$lib/queries'

  // Local state
  let inputValue = $state('')

  // Derivatives
  let canSend = $derived(inputValue.trim().length > 0)

  // Effects
  $effect(() => {
    // Side effects
  })

  // Queries/Mutations
  const { streamMessage, isStreaming } = useChat({
    onStreamStart: () => chatStore.setStreaming(true),
    onStreamEnd: () => chatStore.setStreaming(false)
  })

  // Actions
  async function handleSend() {
    if (!canSend) return

    await streamMessage({
      message: inputValue,
      sessionId: chatStore.currentSessionId
    })

    inputValue = $state('')
  }
</script>
```

### 3. Error Handling

```typescript
// Use error store for global error display
errorStore.subscribe($error => {
  if ($error) {
    // Show error toast or modal
  }
})

// Use error handlers in mutations
const { mutate } = useChat({
  onError: (error) => {
    errorStore.setNetworkError(error.message)
  }
})
```

### 4. Performance Optimization

- Use `staleTime` and `gcTime` appropriately
- Prefetch data when needed
- Use `select` for data transformation
- Cache derived values in stores

## Type Safety

All stores and queries use TypeScript interfaces for type safety:

```typescript
// Type-safe store usage
chatStore.subscribe(($state: ChatState) => {
  // $state has proper typing
})

// Type-safe query usage
const { data: providers } = useProviders({
  select: (data: ProvidersResponse) => {
    // data has proper typing
    return data.providers
  }
})
```