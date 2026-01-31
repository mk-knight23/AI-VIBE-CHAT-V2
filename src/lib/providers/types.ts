export interface ProviderAdapter {
  name: string
  baseUrl: string
  chat(request: ChatRequest): Promise<ChatResponse>
  stream(request: ChatRequest): ReadableStream
  validateKey(key: string): Promise<boolean>
}

export interface ChatRequest {
  messages: Message[]
  model: string
  stream?: boolean
}

export interface ChatResponse {
  content: string
  model: string
  tokens?: number
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export interface ProviderMetadata {
  name: string
  description?: string
  baseUrl: string
  models: string[]
  features?: {
    streaming: boolean
    vision: boolean
    tools: boolean
  }
}