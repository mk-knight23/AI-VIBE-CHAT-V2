# AI-VIBE-CHAT-V2: Quality Standards

## Build Requirements

- [ ] `npm run build` passes
- [ ] `npm run check` (SvelteKit type check) passes
- [ ] No Svelte warnings
- [ ] Bundle size ≤ current - 30%

## Lint Rules

```javascript
// eslint.config.js
export default {
  rules: {
    'svelte/no-unused-svelte-ignore': 'error',
    'svelte/require-event-dispatcher-types': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `ChatMessage.svelte` |
| Routes | SvelteKit convention | `+page.svelte` |
| Stores | camelCase | `chatStore.ts` |
| Runes | $ prefix | `$state`, `$derived` |

## Testing Requirements

| Type | Target |
|------|--------|
| Unit tests | 80% coverage |
| Component tests | 70% coverage |
| E2E tests | Critical paths |

## Performance Goals

| Metric | Target |
|--------|--------|
| Bundle size | < 400 KB |
| First load | < 2s |
| Streaming latency | < 50ms chunks |

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus management
