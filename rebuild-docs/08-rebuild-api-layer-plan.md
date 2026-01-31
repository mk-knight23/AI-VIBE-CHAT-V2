# AI-VIBE-CHAT-V2: API Layer Plan

## API Architecture

**Pattern:** SvelteKit API Routes with Adapter Pattern
**Base:** `+server.ts` files with HTTP methods

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | Send message (streaming) |
| `/api/providers` | GET | List providers |
| `/api/providers/health` | GET | Health check |
| `/api/validate-key` | POST | Validate API key |

---

## SvelteKit Route Example

```typescript
// src/routes/api/chat/+server.ts
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { message, provider, model } = body

  const adapter = getAdapter(provider)
  const stream = await adapter.stream({ message, model })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}
```

---

## Provider Adapter Interface

```typescript
interface ProviderAdapter {
  name: string
  chat(request: ChatRequest): Promise<ChatResponse>
  stream(request: ChatRequest): ReadableStream
  validateKey(key: string): Promise<boolean>
}
```

---

## Streaming with SvelteKit

```typescript
async function* streamGenerator(adapter: ProviderAdapter) {
  const response = await fetch(adapter.baseUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adapter.key}` },
    body: JSON.stringify({ stream: true })
  })

  const reader = response.body?.getReader()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    yield new TextDecoder().decode(value)
  }
}
```

---

## Error Handling

```typescript
export const POST: RequestHandler = async ({ request }) => {
  try {
    // ... handle request
  } catch (error) {
    return json(
      { error: 'Provider unavailable', code: 'PROVIDER_ERROR' },
      { status: 502 }
    )
  }
}
```
