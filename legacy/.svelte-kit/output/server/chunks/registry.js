const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.openai.com/v1",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Paid)", description: "Most capable", contextLength: 128e3, maxTokens: 16384 },
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Paid)", description: "Affordable", contextLength: 128e3, maxTokens: 16384 },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo (Paid)", description: "Fast GPT-4", contextLength: 128e3, maxTokens: 4096 },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Paid)", description: "Efficient", contextLength: 16385, maxTokens: 4096 },
      { id: "o1", name: "O1 (Paid)", description: "Reasoning model", contextLength: 2e5, maxTokens: 1e5 },
      { id: "o1-mini", name: "O1 Mini (Paid)", description: "Fast reasoning", contextLength: 128e3, maxTokens: 65536 }
    ]
  },
  {
    id: "anthropic",
    name: "Anthropic",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.anthropic.com/v1",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Paid)", description: "Most intelligent", contextLength: 2e5, maxTokens: 8192 },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Paid)", description: "Fast", contextLength: 2e5, maxTokens: 8192 },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus (Paid)", description: "Powerful", contextLength: 2e5, maxTokens: 4096 },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet (Paid)", description: "Balanced", contextLength: 2e5, maxTokens: 4096 },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku (Paid)", description: "Compact", contextLength: 2e5, maxTokens: 4096 }
    ]
  },
  {
    id: "google",
    name: "Google Gemini",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: [
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Free)", description: "Latest, 15 RPM free", contextLength: 1e6, maxTokens: 8192 },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Free)", description: "2 RPM free", contextLength: 2e6, maxTokens: 8192 },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Free)", description: "15 RPM free", contextLength: 1e6, maxTokens: 8192 },
      { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash 8B (Free)", description: "15 RPM free", contextLength: 1e6, maxTokens: 8192 }
    ]
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.x.ai/v1",
    models: [
      { id: "grok-beta", name: "Grok Beta (Paid)", description: "xAI flagship", contextLength: 128e3, maxTokens: 8192 },
      { id: "grok-vision-beta", name: "Grok Vision (Paid)", description: "Multimodal", contextLength: 128e3, maxTokens: 8192 },
      { id: "grok-2-1212", name: "Grok 2 (Paid)", description: "Latest Grok", contextLength: 128e3, maxTokens: 8192 }
    ]
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://openrouter.ai/api/v1",
    models: [
      { id: "x-ai/grok-4.1-fast:free", name: "Grok 4.1 Fast (Free)", description: "2M context", contextLength: 2e6, maxTokens: 8192 },
      { id: "tngtech/deepseek-r1t2-chimera:free", name: "DeepSeek R1T2 Chimera (Free)", description: "671B MoE", contextLength: 164e3, maxTokens: 8192 },
      { id: "kwaipilot/kat-coder-pro-v1:free", name: "KAT-Coder-Pro V1 (Free)", description: "Agentic coding", contextLength: 256e3, maxTokens: 8192 },
      { id: "z-ai/glm-4-5-air:free", name: "GLM 4.5 Air (Free)", description: "Lightweight MoE", contextLength: 131e3, maxTokens: 8192 },
      { id: "deepseek/deepseek-v3-0324:free", name: "DeepSeek V3 (Free)", description: "685B flagship", contextLength: 164e3, maxTokens: 8192 },
      { id: "deepseek/r1-0528:free", name: "DeepSeek R1 (Free)", description: "671B reasoning", contextLength: 164e3, maxTokens: 8192 },
      { id: "qwen/qwen3-coder-480b-a35b:free", name: "Qwen3 Coder 480B (Free)", description: "MoE coding", contextLength: 262e3, maxTokens: 8192 },
      { id: "openai/gpt-4o", name: "GPT-4o (Paid)", description: "Via OpenRouter", contextLength: 128e3, maxTokens: 16384 },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Paid)", description: "Via OpenRouter", contextLength: 2e5, maxTokens: 8192 }
    ]
  },
  {
    id: "groq",
    name: "Groq",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.groq.com/openai/v1",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Free)", description: "Free tier", contextLength: 128e3, maxTokens: 32768 },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (Free)", description: "Ultra-fast free", contextLength: 128e3, maxTokens: 8192 },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (Free)", description: "Free tier", contextLength: 32768, maxTokens: 32768 },
      { id: "gemma2-9b-it", name: "Gemma 2 9B (Free)", description: "Google free", contextLength: 8192, maxTokens: 8192 }
    ]
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.deepseek.com/v1",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat (Paid)", description: "General purpose", contextLength: 64e3, maxTokens: 4096 },
      { id: "deepseek-coder", name: "DeepSeek Coder (Paid)", description: "Code specialist", contextLength: 64e3, maxTokens: 4096 },
      { id: "deepseek-reasoner", name: "DeepSeek R1 (Paid)", description: "Reasoning", contextLength: 64e3, maxTokens: 8192 }
    ]
  },
  {
    id: "mistral",
    name: "Mistral AI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.mistral.ai/v1",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large (Paid)", description: "Flagship", contextLength: 128e3, maxTokens: 8192 },
      { id: "mistral-small-latest", name: "Mistral Small (Paid)", description: "Cost-effective", contextLength: 32e3, maxTokens: 8192 },
      { id: "codestral-latest", name: "Codestral (Paid)", description: "Code specialist", contextLength: 32e3, maxTokens: 8192 },
      { id: "pixtral-12b-2409", name: "Pixtral 12B (Paid)", description: "Multimodal", contextLength: 128e3, maxTokens: 8192 }
    ]
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.fireworks.ai/inference/v1",
    models: [
      { id: "accounts/fireworks/models/llama-v3p2-3b-instruct", name: "Llama 3.2 3B (Free)", description: "Free tier", contextLength: 128e3, maxTokens: 8192 },
      { id: "accounts/fireworks/models/gemma2-9b-it", name: "Gemma 2 9B (Free)", description: "Free tier", contextLength: 8192, maxTokens: 8192 },
      { id: "accounts/fireworks/models/llama-v3p3-70b-instruct", name: "Llama 3.3 70B (Paid)", description: "Fast inference", contextLength: 128e3, maxTokens: 8192 }
    ]
  },
  {
    id: "minimax",
    name: "MiniMax",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.minimax.chat/v1",
    models: [
      { id: "abab6.5s-chat", name: "MiniMax 6.5S (Paid)", description: "Latest", contextLength: 245e3, maxTokens: 8192 },
      { id: "abab6.5-chat", name: "MiniMax 6.5 (Paid)", description: "Balanced", contextLength: 245e3, maxTokens: 8192 }
    ]
  },
  {
    id: "megallm",
    name: "MegaLLM",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://ai.megallm.io/v1",
    models: [
      { id: "openai-gpt-oss-20b", name: "OpenAI GPT-oss-20b (Paid)", description: "Advanced reasoning", contextLength: 128e3, maxTokens: 128e3 },
      { id: "llama3.3-70b-instruct", name: "Llama 3.3 70B (Paid)", description: "Open-source LLM", contextLength: 131072, maxTokens: 131072 },
      { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill 70B (Paid)", description: "Reasoning model", contextLength: 128e3, maxTokens: 128e3 },
      { id: "alibaba-qwen3-32b", name: "Qwen3 32B (Paid)", description: "Alibaba AI", contextLength: 131072, maxTokens: 16384 },
      { id: "openai-gpt-oss-120b", name: "OpenAI GPT-oss-120b (Paid)", description: "Superior reasoning", contextLength: 128e3, maxTokens: 128e3 },
      { id: "llama3-8b-instruct", name: "Llama 3.1 8B (Paid)", description: "Compact LLM", contextLength: 8192, maxTokens: 8192 },
      { id: "moonshotai/kimi-k2-instruct-0905", name: "Kimi K2 (Paid)", description: "Moonshot AI", contextLength: 256e3, maxTokens: 56e3 },
      { id: "deepseek-ai/deepseek-v3.1-terminus", name: "DeepSeek V3.1 Terminus (Paid)", description: "Advanced reasoning", contextLength: 163840, maxTokens: 56e3 },
      { id: "qwen/qwen3-next-80b-a3b-instruct", name: "Qwen3 Next 80B (Paid)", description: "Next-gen Qwen", contextLength: 262144, maxTokens: 16384 },
      { id: "deepseek-ai/deepseek-v3.1", name: "DeepSeek V3.1 (Paid)", description: "Latest DeepSeek", contextLength: 128e3, maxTokens: 16384 },
      { id: "mistralai/mistral-nemotron", name: "Mistral Nemotron (Paid)", description: "High-performance", contextLength: 128e3, maxTokens: 16384 },
      { id: "minimaxai/minimax-m2", name: "MiniMax M2 (Paid)", description: "Advanced AI", contextLength: 128e3, maxTokens: 32e3 }
    ]
  },
  {
    id: "agentrouter",
    name: "Agent Router",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://agentrouter.org/v1",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Paid)", description: "Routed OpenAI", contextLength: 128e3, maxTokens: 16384 },
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Paid)", description: "Compact GPT-4o", contextLength: 128e3, maxTokens: 16384 },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Paid)", description: "Routed Anthropic", contextLength: 2e5, maxTokens: 8192 },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Paid)", description: "Routed Google", contextLength: 1e6, maxTokens: 8192 },
      { id: "llama-3.3-70b-instruct", name: "Llama 3.3 70B (Paid)", description: "Routed Meta", contextLength: 128e3, maxTokens: 8192 }
    ]
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    requiresApiKey: false,
    requiresBaseUrl: true,
    baseUrl: "http://localhost:11434",
    models: [
      { id: "llama3.2:3b", name: "Llama 3.2 3B (Free)", description: "100% free local", contextLength: 128e3, maxTokens: 8192 },
      { id: "llama3.2:1b", name: "Llama 3.2 1B (Free)", description: "100% free local", contextLength: 128e3, maxTokens: 8192 },
      { id: "qwen2.5:7b", name: "Qwen 2.5 7B (Free)", description: "100% free local", contextLength: 32768, maxTokens: 8192 },
      { id: "mistral:7b", name: "Mistral 7B (Free)", description: "100% free local", contextLength: 32768, maxTokens: 8192 },
      { id: "codellama:13b", name: "Code Llama 13B (Free)", description: "100% free local", contextLength: 16384, maxTokens: 4096 }
    ]
  },
  {
    id: "lmstudio",
    name: "LM Studio (Local)",
    requiresApiKey: false,
    requiresBaseUrl: true,
    baseUrl: "http://localhost:1234/v1",
    models: [
      { id: "local-model", name: "Local Model (Free)", description: "100% free, any model", contextLength: 32768, maxTokens: 4096 }
    ]
  },
  {
    id: "bedrock",
    name: "AWS Bedrock",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
    models: [
      { id: "anthropic.claude-3-5-sonnet-20241022-v2:0", name: "Claude 3.5 Sonnet (Paid)", description: "AWS hosted", contextLength: 2e5, maxTokens: 8192 },
      { id: "anthropic.claude-3-haiku-20240307-v1:0", name: "Claude 3 Haiku (Paid)", description: "Fast", contextLength: 2e5, maxTokens: 4096 },
      { id: "meta.llama3-3-70b-instruct-v1:0", name: "Llama 3.3 70B (Paid)", description: "AWS hosted", contextLength: 128e3, maxTokens: 8192 },
      { id: "amazon.nova-pro-v1:0", name: "Amazon Nova Pro (Paid)", description: "AWS native", contextLength: 3e5, maxTokens: 5e3 },
      { id: "amazon.nova-lite-v1:0", name: "Amazon Nova Lite (Paid)", description: "Fast AWS", contextLength: 3e5, maxTokens: 5e3 }
    ]
  },
  {
    id: "vertexai",
    name: "GCP Vertex AI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://us-central1-aiplatform.googleapis.com/v1",
    models: [
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Paid)", description: "GCP hosted", contextLength: 1e6, maxTokens: 8192 },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Paid)", description: "GCP hosted", contextLength: 2e6, maxTokens: 8192 },
      { id: "claude-3-5-sonnet@20241022", name: "Claude 3.5 Sonnet (Paid)", description: "Via Vertex", contextLength: 2e5, maxTokens: 8192 }
    ]
  },
  {
    id: "chutes",
    name: "Chutes AI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.chutes.ai/v1",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Paid)", description: "Via Chutes", contextLength: 128e3, maxTokens: 16384 },
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet (Paid)", description: "Via Chutes", contextLength: 2e5, maxTokens: 8192 }
    ]
  },
  {
    id: "glama",
    name: "Glama",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.glama.ai/v1",
    models: [
      { id: "llama-3.3-70b", name: "Llama 3.3 70B (Free)", description: "Free tier", contextLength: 128e3, maxTokens: 8192 },
      { id: "mixtral-8x7b", name: "Mixtral 8x7B (Free)", description: "Free tier", contextLength: 32768, maxTokens: 8192 }
    ]
  },
  {
    id: "unbound",
    name: "Unbound",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://api.unbound.ai/v1",
    models: [
      { id: "llama-3.3-70b", name: "Llama 3.3 70B (Paid)", description: "Unbound hosted", contextLength: 128e3, maxTokens: 8192 }
    ]
  },
  {
    id: "ovhcloud",
    name: "OVHcloud AI Endpoints",
    requiresApiKey: true,
    requiresBaseUrl: false,
    baseUrl: "https://llama-3-3-70b-instruct.endpoints.kepler.ai.cloud.ovh.net/v1",
    models: [
      { id: "Llama-3.3-70B-Instruct", name: "Llama 3.3 70B (Paid)", description: "OVH hosted", contextLength: 128e3, maxTokens: 8192 }
    ]
  }
];
const getProvider = (id) => {
  return PROVIDERS.find((p) => p.id === id);
};
export {
  PROVIDERS as P,
  getProvider as g
};
