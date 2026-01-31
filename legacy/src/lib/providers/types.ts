export interface AIModel {
  id: string;
  name: string;
  description?: string;
  contextLength?: number;
  maxTokens?: number;
}

export interface AIProvider {
  id: string;
  name: string;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
  baseUrl?: string;
  models: AIModel[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
}
