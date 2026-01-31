# AI-VIBE-CHAT-V2: State Flow Design

## State Architecture

**Pattern:** TanStack Query for server state + Svelte stores for UI
**Reactivity:** Svelte 5 runes ($state, $derived, $effect)

---

## Data Flow

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

---

## TanStack Query Integration

```svelte
<script>
  import { createQuery, createMutation } from '@tanstack/svelte-query'

  // Query for providers
  const providers = createQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders
  })

  // Mutation for chat
  const sendMessage = createMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      messages = [...messages, data]
    }
  })
</script>
```

---

## Local State with Runes

```svelte
<script>
  // Local component state
  let inputValue = $state('')
  let isSidebarOpen = $state(true)

  // Derived state
  let canSend = $derived(inputValue.trim().length > 0)

  // Effects
  $effect(() => {
    localStorage.setItem('sidebar', isSidebarOpen)
  })
</script>
```

---

## Streaming State

```svelte
<script>
  let streamingContent = $state('')
  let isStreaming = $state(false)

  async function streamMessage(message: string) {
    isStreaming = true
    streamingContent = ''

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    })

    const reader = response.body?.getReader()
    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      streamingContent += new TextDecoder().decode(value)
    }

    isStreaming = false
  }
</script>
```
