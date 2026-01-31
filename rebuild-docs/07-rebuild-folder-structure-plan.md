# AI-VIBE-CHAT-V2: Folder Structure Plan

## SvelteKit Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── chat/
│   │   ├── ui/              # shadcn-svelte
│   │   └── settings/
│   ├── stores/              # Svelte stores
│   ├── queries/             # TanStack Query
│   ├── providers/           # LLM adapters
│   └── utils/               # Helpers
├── routes/                  # SvelteKit routes
│   ├── +layout.svelte
│   ├── +page.svelte         # Home/chat
│   ├── api/
│   │   ├── chat/+server.ts
│   │   └── providers/+server.ts
│   └── settings/+page.svelte
├── app.html
└── app.d.ts
static/
├── manifest.json
└── icons/
tests/
├── unit/
└── e2e/
```

## Naming Conventions

- Components: PascalCase.svelte
- Routes: +page.svelte, +layout.svelte
- Server: +server.ts
- Stores: camelCase.ts
- Utils: camelCase.ts
