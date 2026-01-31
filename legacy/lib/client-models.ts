"use client"

// Client-side model data (no API calls, just model information)
// This can be safely imported in client components

export interface ClientFreeModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
  };
  isFree: boolean;
}

// All current free models from OpenRouter (Jan 2025)
export const FREE_MODELS: ClientFreeModel[] = [
  {
    id: 'minimax/minimax-m2',
    name: 'MiniMax M2',
    description: 'Compact 10B activated parameters (230B total) model optimized for coding and agentic workflows',
    context_length: 197000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 197000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'tngtech/deepseek-r1t2-chimera',
    name: 'DeepSeek R1T2 Chimera',
    description: 'Second-generation 671B mixture-of-experts model with Assembly-of-Experts merge',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'z-ai/glm-4-5-air',
    name: 'GLM 4.5 Air',
    description: 'Lightweight MoE model with hybrid inference modes (thinking and non-thinking)',
    context_length: 131000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 131000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'tngtech/deepseek-r1t-chimera',
    name: 'DeepSeek R1T Chimera',
    description: 'Merge of DeepSeek-R1 and DeepSeek-V3, combining reasoning with token efficiency',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'deepseek/deepseek-v3-0324',
    name: 'DeepSeek V3 0324',
    description: '685B-parameter mixture-of-experts model, latest iteration of flagship chat model',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'deepseek/r1-0528',
    name: 'DeepSeek R1 0528',
    description: '671B parameters with 37B active, open-source model with performance on par with OpenAI o1',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'qwen/qwen3-235b-a22b',
    name: 'Qwen3 235B A22B',
    description: '235B MoE model with 22B active parameters, supports thinking and non-thinking modes',
    context_length: 131000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 131000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'qwen/qwen3-coder-480b-a35b',
    name: 'Qwen3 Coder 480B A35B',
    description: 'MoE code generation model with 480B parameters, 35B active for agentic coding tasks',
    context_length: 262000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 262000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'google/gemini-2.0-flash-experimental',
    name: 'Gemini 2.0 Flash Experimental',
    description: 'Fast multimodal model with enhanced understanding, coding, and function calling',
    context_length: 1050000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 1050000, max_completion_tokens: 8192 },
    isFree: true
  }
];

export const getDefaultModel = (): string => {
  return FREE_MODELS[0]?.id || 'minimax/minimax-m2';
};

export const getModelById = (id: string): ClientFreeModel | undefined => {
  return FREE_MODELS.find(model => model.id === id);
};
