# AI-VIBE-CHAT-V2: Rebuild Overview

## Current Project Summary

**Project Name:** chatgpt-clone-multi-provider
**Current Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS + Zustand
**Status:** Production-ready with 27+ providers, 100+ models

### What Exists Today

- Multi-provider AI chat supporting 27+ providers
- 100+ AI models (free and paid)
- Real-time streaming with Server-Sent Events
- Dark/Light theme support
- Responsive design with Radix UI
- Zustand state management with persistence
- Provider health monitoring
- API key validation
- 71 TypeScript files, ~8,000 lines of code

### Current Limitations

1. **React complexity** - Complex state management for streaming
2. **Client-side API calls** - API keys exposed in browser
3. **Build size** - Large bundle with all providers
4. **Hydration issues** - Next.js hydration mismatches with state
5. **Testing difficulty** - React Testing Library limitations with streams
6. **Provider bloat** - All 27 providers loaded upfront

### Known Risks

| Risk | Severity | Impact |
|------|----------|--------|
| React 19 breaking changes | Medium | Compatibility issues |
| API key exposure | High | Security vulnerability |
| Bundle size | Medium | Performance impact |
| Hydration complexity | Medium | Development friction |
| Provider API changes | Low | Maintenance burden |

### Rebuild vs Reuse Analysis

| Component | Decision | Rationale |
|-----------|----------|-----------|
| Provider adapters | **Reuse** | Logic is sound, language-agnostic |
| Streaming logic | **Rebuild** | Svelte 5 runes better for streams |
| UI components | **Rebuild** | Svelte + Tailwind 4 |
| State management | **Rebuild** | Zustand → TanStack Query |
| Routing | **Rebuild** | Next.js → SvelteKit file routes |
| Build system | **Rebuild** | Webpack/Vite → SvelteKit |

### Rebuild Goals

1. **Framework Migration** - React → Svelte 5 with runes
2. **Performance** - Smaller bundles, faster rendering
3. **Developer Experience** - Svelte simplicity, less boilerplate
4. **Streaming** - Native Svelte 5 streaming support
5. **Server Integration** - SvelteKit API routes
6. **Maintain Features** - Preserve all 27+ providers

### Non-Goals

- Reducing provider count
- Adding real-time collaboration
- Voice/video features
- Mobile native apps

### Success Criteria

| Criteria | Measurement |
|----------|-------------|
| Feature parity | 100% of providers working |
| Bundle size | -30% vs current |
| Build time | ≤ current |
| Lighthouse | ≥ 90 all categories |
| Test coverage | ≥ 80% |

### Timeline Estimate

| Phase | Duration |
|-------|----------|
| Audit | 2 days |
| Setup | 3 days |
| UI Rebuild | 6 days |
| State/Providers | 5 days |
| Testing | 4 days |
| **Total** | **~20 days** |
