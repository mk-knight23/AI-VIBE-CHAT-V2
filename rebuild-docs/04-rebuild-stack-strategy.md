# AI-VIBE-CHAT-V2: Stack Strategy

## Stack Direction

**From:** Next.js 15 + React 19 + Tailwind + Zustand
**To:** SvelteKit + Svelte 5 + Tailwind 4 + TanStack Query

**Rationale:** Svelte 5 runes provide superior reactive streaming, smaller bundles, simpler mental model.

---

## Core Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | SvelteKit 2.x | Full-stack framework |
| UI | Svelte 5 | Reactive components with runes |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Components | shadcn-svelte | Accessible components |
| State | TanStack Query | Server state management |
| Forms | formsnap + zod | Form handling |
| Icons | lucide-svelte | Icon library |

---

## Styling Strategy

**Theme:** "Minimalist Light with Neon Accents"

- Light base (#ffffff, #f8fafc)
- Neon cyan accents (#00d9ff)
- Neon purple accents (#b829f7)
- Clean typography (Inter)
- Subtle shadows

---

## Streaming Support

Svelte 5 streaming with ReadableStream:

```svelte
<script>
  let stream = $state(new ReadableStream())

  async function sendMessage() {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    })

    const reader = response.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      content += new TextDecoder().decode(value)
    }
  }
</script>
```

---

## Key Differences from V1

| Aspect | V1 (Vue/Nuxt) | V2 (Svelte/SvelteKit) |
|--------|---------------|----------------------|
| Reactivity | Vue refs | Svelte 5 runes |
| Templates | Vue templates | Svelte components |
| State | Pinia | TanStack Query |
| Routing | Nuxt file routes | SvelteKit file routes |
| Server | Nitro | SvelteKit adapters |
| Styling | Glassmorphism dark | Minimalist light + neon |
