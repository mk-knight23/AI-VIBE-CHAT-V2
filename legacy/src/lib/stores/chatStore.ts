import { writable, derived, get } from 'svelte/store';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}

function createChatStore() {
  const { subscribe, update, set } = writable<ChatState>({
    messages: [],
    isLoading: false
  });

  return {
    subscribe,
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      update(state => ({
        ...state,
        messages: [...state.messages, {
          ...message,
          id,
          timestamp: Date.now()
        }]
      }));
      return id;
    },
    updateMessage: (id: string, content: string) =>
      update(state => ({
        ...state,
        messages: state.messages.map(msg =>
          msg.id === id ? { ...msg, content: msg.content + content } : msg
        )
      })),
    clearMessages: () => update(state => ({ ...state, messages: [] })),
    setLoading: (isLoading: boolean) =>
      update(state => ({ ...state, isLoading }))
  };
}

export const chatStore = createChatStore();
export const messageCount = derived(chatStore, $chat => $chat.messages.length);
