# AI-VIBE-CHAT-V2: Rebuild Audit Plan

## Repository Audit Checklist

### 1. Code Inventory

- [ ] Catalog all 71 TypeScript/TSX files
- [ ] Document 50 Radix UI components
- [ ] List 27 provider implementations
- [ ] Inventory custom hooks
- [ ] Map component dependencies
- [ ] Identify dead/stale code

### 2. Build Verification

```bash
npm install
npm run build
npm run lint
npm run test
```

**Baseline Metrics:**
- Build time: ___ seconds
- Bundle size: ___ KB
- Test coverage: ___%
- Lint errors: ___

### 3. Dependency Review

| Package | Status | Svelte Equivalent |
|---------|--------|-------------------|
| next | Remove | @sveltejs/kit |
| react | Remove | svelte |
| zustand | Remove | @tanstack/svelte-query |
| @radix-ui/* | Remove | shadcn-svelte |
| react-hook-form | Remove | formsnap + zod |

### 4. Dead Code Detection

**Tools:**
- `knip` for unused exports
- `depcheck` for unused dependencies
- Manual review for stale providers

### 5. Provider Audit

| Provider | Last Tested | Working | Priority |
|----------|-------------|---------|----------|
| OpenAI | | | High |
| Anthropic | | | High |
| OpenRouter | | | High |
| Groq | | | High |
| ... | | | |

### 6. Risk Scan

- [ ] Hardcoded API keys
- [ ] Console.log statements
- [ ] TypeScript any types
- [ ] Unhandled promises
- [ ] Missing error boundaries

### 7. Asset Inventory

- [ ] Icons (Lucide)
- [ ] Static images
- [ ] Font files
- [ ] PWA assets
