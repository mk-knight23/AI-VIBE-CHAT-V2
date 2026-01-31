# AI-VIBE-CHAT-V2: Target Architecture

## Architecture Overview

**Pattern:** SvelteKit Universal App with TanStack Query
**Approach:** Server-rendered with client-side hydration
**Paradigm:** Svelte 5 Runes for reactive state

---

## Layer Architecture

### 1. UI Layer (Svelte Components)

**Responsibility:** Render UI, handle events

**Structure:**
- Svelte 5 components with `.svelte` extension
- Runes-based reactivity ($state, $derived, $effect)
- Scoped styles with `<style>`

### 2. State Layer (TanStack Query + Svelte Stores)

**Responsibility:** Server state caching, synchronization

**Pattern:**
- TanStack Query for server state
- Svelte writable stores for UI state

### 3. API Layer (SvelteKit)

**Responsibility:** API routes, server logic

**Structure:**
- `+server.ts` files for API endpoints
- Form actions for mutations
- Server load functions

### 4. Provider Layer

**Responsibility:** LLM provider abstraction

**Pattern:**
- Class-based adapters
- Factory pattern
- Error normalization

---

## Data Flow

```
User Input
    ↓
Svelte Component
    ↓
TanStack Query Mutation
    ↓
SvelteKit API Route
    ↓
Provider Adapter
    ↓
LLM API
    ↑
Stream Response
    ↑
TanStack Query Cache Update
    ↑
Svelte Component ($state)
```

---

## Svelte 5 Runes Pattern

```svelte
<script>
  // State
  let messages = $state([])
  let isStreaming = $state(false)

  // Derived
  let messageCount = $derived(messages.length)

  // Effect
  $effect(() => {
    if (isStreaming) scrollToBottom()
  })
</script>
```
