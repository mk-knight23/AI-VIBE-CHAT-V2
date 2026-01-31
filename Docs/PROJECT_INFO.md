# AI-VIBE-CHAT-V2: Multi-Provider AI Chat

## Project Overview

**chatgpt-clone-multi-provider** is a modern, feature-rich AI chat application providing a unified interface for accessing 27+ AI providers with over 100 free and paid models. It's designed as a ChatGPT clone with multi-provider support, real-time streaming, and theme customization.

---

## Purpose

The application solves the problem of accessing multiple AI models through different APIs by providing:
- Instant provider switching - Compare responses from GPT-4o, Claude 3.5, and Llama 3.3
- Access to 100+ free models through OpenRouter, Groq, Ollama, and others
- Privacy through local providers like Ollama
- Cost savings through multiple free tiers
- Unified experience across all AI interactions

**Target Users:**
- Developers comparing AI model performance
- Cost-conscious users seeking free AI alternatives
- Privacy-focused users wanting local AI
- AI enthusiasts exploring different models

---

## Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2.4 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type-safe JavaScript |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| Node.js | 18+ | Runtime environment |

### UI Components & Styling
- **Radix UI** - 28 accessible, unstyled UI primitives
- **shadcn/ui** - Component architecture system
- **Lucide React** - Icon library
- **Geist** - Modern font family
- **Tailwind CSS Animate** - Animation utilities
- **Class Variance Authority** - Component variant management
- **CLSX & Tailwind Merge** - Class name utilities

### State Management & Forms
| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | 5.0.2 | Lightweight state management |
| React Hook Form | 7.x | Form validation |
| Zod | 3.24.1 | Schema validation |
| @hookform/resolvers | 3.9.1 | Form resolvers |

### Additional Features
- Next Themes - Dark/light theme support
- Date-fns | 4.1.0 - Date formatting
- Embla Carousel - Touch-enabled carousels
- Recharts - Data visualization
- Vaul - Drawer component
- Sonner - Toast notifications
- CMDK - Command palette

---

## Key Features

### Multi-Provider AI Support (27+ Providers)

**Major Cloud Providers:**
- OpenAI (GPT-4o, GPT-4o Mini, GPT-3.5 Turbo, O1, O1 Mini)
- Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus)
- Google Gemini (Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash)
- xAI/Grok (Grok Beta, Grok Vision, Grok 2)

**Aggregators & Routers:**
- OpenRouter - 100+ models through one API
- MegaLLM - 12+ premium models
- Agent Router - 10+ intelligently routed models

**Specialized Providers:**
- Groq - Ultra-fast inference
- DeepSeek - Reasoning and coding models
- Mistral AI - Mistral Large, Small, Codestral
- Fireworks AI - Fast inference
- MiniMax - Advanced conversational AI

**Local & Privacy-Focused:**
- Ollama - Local model hosting
- LM Studio - Local model hosting with GUI

**Enterprise Cloud:**
- AWS Bedrock - Claude, Llama, Amazon Nova
- GCP Vertex AI - Gemini, Claude
- OVHcloud AI - Llama 3.3 70B

**Other Providers:**
- Cohere, Together AI, Perplexity, Replicate, Hugging Face, Cloudflare Workers AI, Cerebras, Chutes AI, Glama, Unbound

### User Interface Features
- Real-time Streaming - Server-sent events for live response streaming
- Dark/Light Theme - Toggle with system preference detection
- Responsive Design - Mobile-first, works on all devices
- Modern Chat Interface - Message bubbles with avatars
- Smart Loading States - Animated states: "Finding...", "Thinking...", "Generating..."
- Copy to Clipboard - One-click message copying
- Persistent Settings - API keys and preferences saved to localStorage

### Technical Features
- Unified API Interface - Single codebase supporting all providers
- TypeScript Throughout - Full type safety
- Error Handling - Graceful fallbacks with user-friendly messages
- API Key Validation - Real-time validation with visual feedback
- Security-First - No server storage of credentials

---

## Project Structure

```
AI-VIBE-CHAT-V2/
├── app/                     # Next.js App Router
│   ├── api/chat/            # API routes
│   │   └── route.ts         # Chat API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main chat interface
├── components/              # React components
│   ├── ui/                  # 50 Radix UI components
│   ├── loading-states.tsx   # Animated loading states
│   ├── model-selector.tsx   # Model selection UI
│   ├── settings-dialog.tsx  # Provider configuration
│   └── theme-provider.tsx   # Theme context
├── hooks/                   # Custom React hooks
│   ├── use-chat.ts          # Chat logic hook
│   ├── use-mobile.tsx       # Mobile detection
│   ├── use-openrouter-chat.ts
│   └── use-toast.ts         # Toast notifications
├── lib/                     # Utilities and configurations
│   ├── providers/           # AI provider implementations
│   │   ├── client.ts        # Unified API client
│   │   ├── registry.ts      # Provider definitions
│   │   ├── types.ts         # TypeScript types
│   │   └── validator.ts     # API key validation
│   ├── client-models.ts     # Client-side model definitions
│   ├── demo-mode.ts         # Demo functionality
│   ├── openrouter.ts        # OpenRouter integration
│   ├── settings-store.ts    # Zustand state management
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── styles/                  # Additional styles
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
├── components.json          # shadcn/ui configuration
├── .env.example             # Environment variables template
├── README.md                # Documentation
└── SECURITY.md              # Security guidelines
```

---

## Developer Information

- **Project Name:** chatgpt-clone-multi-provider
- **Version:** 2.0.0
- **Description:** Multi-Provider AI Chat - 27+ Providers, 100+ Free Models
- **Repository:** https://github.com/mk-knight23/Chatgpt-Clone
- **Issues:** https://github.com/mk-knight23/Chatgpt-Clone/issues
- **License:** MIT License

**Code Statistics:**
- Total Files: 71 TypeScript/TSX files
- Total Lines of Code: ~7,912 lines
- UI Components: 50 Radix UI components

---

## Setup Guide

### Prerequisites
- Node.js 18+
- API key(s) for chosen provider(s) (optional for local providers)

### Local Development

```bash
# Clone the repository
git clone https://github.com/mk-knight23/Chatgpt-Clone.git
cd Chatgpt-Clone

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 and configure your provider in Settings.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start development server |
| build | `npm run build` | Create production build |
| start | `npm start` | Start production server |
| lint | `npm run lint` | Run ESLint |

### Configuration Steps

1. Click **Settings** in the top-right corner
2. **Select Provider** from the dropdown (27+ options)
3. **Choose Model** from available options (100+ models)
4. **Enter API Key** (if required by provider)
5. **Set Base URL** (for local providers like Ollama/LM Studio)
6. **Save Settings** and start chatting

### Getting API Keys (Free Tiers Available)

- **OpenRouter:** https://openrouter.ai/keys - Free tier with many models
- **Groq:** https://console.groq.com - Free tier with fast inference
- **Google AI:** https://makersuite.google.com/app/apikey - Free tier available
- **OpenAI:** https://platform.openai.com/api-keys - Paid
- **Anthropic:** https://console.anthropic.com - Paid

### Local Providers (No API Key)

- **Ollama:** Install from https://ollama.ai
  Default URL: `http://localhost:11434`
- **LM Studio:** Install from https://lmstudio.ai
  Default URL: `http://localhost:1234/v1`

---

## Dependencies

### Production Dependencies (35 packages)
- next, react, react-dom
- @radix-ui/* (28 packages)
- lucide-react, geist
- zustand
- react-hook-form, @hookform/resolvers, zod
- tailwindcss, autoprefixer
- class-variance-authority, clsx, tailwind-merge
- date-fns, cmdk, embla-carousel-react
- input-otp, react-resizable-panels, recharts
- sonner, vaul, next-themes

### Development Dependencies (5 packages)
- typescript, @types/node, @types/react, @types/react-dom
- postcss, tailwindcss

---

## Configuration Files

### Next.js Configuration (next.config.mjs)
```javascript
{
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true }
}
```

### TypeScript Configuration (tsconfig.json)
- Target: ES6
- Module: ESNext with Bundler resolution
- Strict mode enabled
- Path aliases: `@/*` maps to root
- JSX: Preserve

### Tailwind CSS Configuration (tailwind.config.ts)
- Dark mode: Class-based
- Content paths: pages, components, app directories
- Extended colors: Full design system with CSS variables
- Custom animations: Accordion open/close
- Plugins: tailwindcss-animate

### shadcn/ui Configuration (components.json)
- Style: Default
- RSC: Enabled
- TypeScript: Yes
- Base color: Neutral
- CSS variables: Enabled

---

## Security Features

### API Key Security
- Client-Side Storage: API keys stored in browser localStorage only
- No Server Storage: Credentials never stored on server
- Optional Environment Variables: Support for `.env.local` (gitignored)
- Validation: Real-time API key validation before saving

### Security Guidelines
- Never commit API keys to Git
- Immediate key revocation instructions if exposed
- HTTPS recommended for production
- Local providers available for complete privacy

### Error Handling
- Graceful error messages without sensitive data exposure
- Specific HTTP status code handling (401, 402, 429, 500)
- User-friendly error messages in the UI

---

## Architecture Highlights

### Provider Pattern Architecture
1. **Registry Pattern** - Centralized provider definitions
2. **Strategy Pattern** - Provider-specific streaming implementations
3. **Type Safety** - Full TypeScript definitions
4. **Validation Layer** - API key verification

### State Management
- Zustand with persistence middleware
- Settings stored in localStorage
- Reactive state across components
- Default provider: OpenAI with GPT-4o Mini

### Streaming Architecture
- Server-Sent Events (SSE) for real-time responses
- Async generators for streaming chunks
- Provider-specific stream parsing
- Error handling with stream termination

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. No environment variables needed (API keys stored client-side)
4. Deploy

### Other Platforms
Compatible with: Netlify, Railway, DigitalOcean, AWS Amplify, or any Node.js host
