# 🤖 Multi-Provider AI Chat

A modern, feature-rich AI chat application supporting 27+ AI providers with 100+ free r models. Built with Next.js, featuring real-time streaming, theme support, and a unified interface for all major AI APIs.

## 🚀 Live Demo

**📍 Deploy to Vercel:**
1. Visit [Vercel.com](https://vercel.com)
2. Sign in with GitHub and import your repository
3. Add environment variables for your chosen providers (see Configuration section)
4. Click "Deploy"

## ✨ Features

### 🤖 **Multi-Provider Support (29+ Providers)**
- **MegaLLM** - 12+ premium models (GPT-4o, Claude 3.5, Gemini 2.0, Llama 3.3)
- **Agent Router** - 10+ routed models with intelligent selection
- **OpenRouter** - Access to 100+ models through one API
- **OpenAI** - GPT-3.5 Turbo, GPT-4o Mini
- **Anthropic** - Claude 3 Haiku
- **Google AI** - Gemini 1.5 Flash, Gemini 1.5 Pro
- **Groq** - Ultra-fast Llama 3.3 70B, Mixtral 8x7B
- **Mistral AI** - Mistral Small, Mistral Large
- **Cohere** - Command R, Command R+
- **Together AI** - Llama 3.3 70B Turbo
- **DeepSeek** - DeepSeek Chat, DeepSeek Coder
- **Perplexity** - Sonar models with web search
- **Fireworks AI** - Fast inference models
- **Replicate** - Open source models
- **Hugging Face** - Community models
- **Ollama** - Local inference (privacy-first)
- **LM Studio** - Local model hosting
- **AWS Bedrock** - Enterprise AI models
- **Cloudflare Workers AI** - Edge inference
- **Cerebras** - Ultra-fast inference
- **And 10+ more providers!**

### 🎨 **User Interface**
- **Real-time Streaming** responses with animated loading states
- **Provider & Model Selection** with cascading dropdowns
- **Dark/Light Theme** toggle
- **Responsive Design** for all devices
- **Modern Chat Interface** with message bubbles
- **Smart Loading States** (Finding, Thinking, Generating)

### 🛠️ **Technical Features**
- **Unified API Interface** - One codebase for all providers
- **Persistent Settings** - API keys and preferences saved locally
- **Error Handling** with graceful fallbacks
- **TypeScript** throughout
- **Server-Sent Events** for streaming
- **Production Ready** optimization

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **State Management:** Zustand
- **Themes:** Next Themes
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- API key(s) for your chosen provider(s)

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

Open [http://localhost:3000](http://localhost:3000) and configure your provider in Settings.

## 🔑 Configuration

### Provider Setup

1. **Click Settings** in the top-right corner
2. **Select Provider** from the dropdown
3. **Choose Model** from available options
4. **Enter API Key** (if required)
5. **Set Base URL** (for local providers like Ollama)
6. **Save Settings**

### Getting API Keys

- **OpenRouter:** [openrouter.ai/keys](https://openrouter.ai/keys) - Free tier available
- **OpenAI:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic:** [console.anthropic.com](https://console.anthropic.com)
- **Google AI:** [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **Groq:** [console.groq.com](https://console.groq.com) - Free tier with fast inference
- **Mistral:** [console.mistral.ai](https://console.mistral.ai)
- **Cohere:** [dashboard.cohere.com](https://dashboard.cohere.com)
- **Together AI:** [api.together.xyz](https://api.together.xyz)

### Local Providers (No API Key Required)

- **Ollama:** Install from [ollama.ai](https://ollama.ai), default URL: `http://localhost:11434`
- **LM Studio:** Install from [lmstudio.ai](https://lmstudio.ai), default URL: `http://localhost:1234/v1`

## 📁 Project Structure

```
Chatgpt-Clone/
├── app/
│   ├── api/chat/          # Unified chat API endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── components/
│   ├── ui/                # Radix UI components
│   ├── settings-dialog.tsx # Provider configuration
│   └── loading-states.tsx  # Animated loading states
├── lib/
│   ├── providers/
│   │   ├── registry.ts    # All 27+ providers
│   │   ├── client.ts      # Unified API client
│   │   └── types.ts       # Type definitions
│   └── settings-store.ts  # Zustand state management
└── hooks/
    └── use-chat.ts        # Chat logic hook
```

## 🎯 Usage

1. **Open Settings** and configure your preferred provider
2. **Select a Model** from the available options
3. **Enter API Key** (stored locally in browser)
4. **Start Chatting** - responses stream in real-time
5. **Switch Providers** anytime to compare models

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. No environment variables needed (API keys stored client-side)
4. Deploy

### Other Platforms
Works on: Netlify, Railway, DigitalOcean, AWS Amplify, or any Node.js host

## 🔒 Security & Privacy

- **API Keys** stored locally in browser (localStorage)
- **No Server Storage** of credentials
- **Local Providers** (Ollama, LM Studio) for complete privacy
- **HTTPS** recommended for production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **All AI Providers** for their amazing APIs
- **Next.js** - React framework
- **Radix UI** - Accessible components
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/mk-knight23/Chatgpt-Clone/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mk-knight23/Chatgpt-Clone/discussions)

---

**Built with ❤️ - Supporting 27+ AI providers in one unified interface**

*Experience the power of multiple AI providers with seamless switching and real-time streaming.*
