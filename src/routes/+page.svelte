<script lang="ts">
  import { Button, Input, Card, ScrollArea, Avatar, Badge, Separator } from '$lib/components/ui'
  import { chatStore, type Message } from '$lib/stores/chatStore'
  import { useChat } from '$lib/queries/useChat'

  // Local state for input
  let inputValue = ''
  let messagesContainer: HTMLDivElement

  // Chat hook
  const chat = useChat({
    onSuccess: () => {
      inputValue = ''
    },
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })

  // Derived state
  $: messages = $chatStore.messages
  $: isStreaming = $chatStore.streaming
  $: isLoading = $chatStore.loading

  // Auto-scroll to bottom when new messages arrive
  $: if (messages.length > 0 && messagesContainer) {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }, 0)
  }

  // Send message handler
  async function handleSend() {
    if (!inputValue.trim() || isLoading || isStreaming) return

    const content = inputValue.trim()

    // Add user message
    chatStore.addMessage({
      content,
      role: 'user',
      status: 'sent'
    })

    // Clear input
    inputValue = ''

    // Add placeholder for assistant response
    const assistantMessageId = chatStore.addMessage({
      content: '',
      role: 'assistant',
      status: 'sending'
    })

    // Send to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          providerId: 'mock',
          modelId: 'mock-model',
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Update assistant message with response
      chatStore.updateMessage(assistantMessageId, {
        content: data.content || 'I received your message.',
        status: 'sent'
      })
    } catch (error) {
      chatStore.updateMessage(assistantMessageId, {
        content: 'Sorry, I encountered an error. Please try again.',
        status: 'failed'
      })
      console.error('Failed to send message:', error)
    }
  }

  // Handle key press (Enter to send)
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  // Clear chat
  function handleClear() {
    chatStore.clearMessages()
  }

  // Format timestamp
  function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
</script>

<svelte:head>
  <title>AI VIBE Chat</title>
</svelte:head>

<div class="flex flex-col h-screen bg-[var(--bg-primary)]">
  <!-- Header -->
  <header class="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)]">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded gradient-cyan-purple flex items-center justify-center">
        <span class="text-white font-bold text-sm">AI</span>
      </div>
      <h1 class="text-xl font-semibold text-[var(--text-primary)]">AI VIBE Chat</h1>
      <Badge variant="info">V2</Badge>
    </div>
    <div class="flex items-center gap-2">
      {#if messages.length > 0}
        <Button variant="secondary" size="sm" on:click={handleClear}>
          Clear Chat
        </Button>
      {/if}
    </div>
  </header>

  <!-- Main Chat Area -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Messages -->
    <div class="flex-1 flex flex-col max-w-4xl mx-auto w-full">
      <!-- Message List -->
      <div
        bind:this={messagesContainer}
        class="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {#if messages.length === 0}
          <!-- Welcome State -->
          <div class="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div class="w-16 h-16 rounded-lg gradient-cyan-purple flex items-center justify-center neon-glow-cyan">
              <span class="text-white font-bold text-2xl">AI</span>
            </div>
            <h2 class="text-2xl font-semibold text-[var(--text-primary)]">Welcome to AI VIBE Chat</h2>
            <p class="text-[var(--text-secondary)] max-w-md">
              Start a conversation by typing a message below. This is a demo with a mock provider.
            </p>
            <div class="flex gap-2 mt-4">
              <Badge variant="default">SvelteKit</Badge>
              <Badge variant="secondary">Tailwind</Badge>
              <Badge variant="success">Running</Badge>
            </div>
          </div>
        {:else}
          {#each messages as message (message.id)}
            <div class="flex gap-3 {message.role === 'user' ? 'flex-row-reverse' : ''}">
              <!-- Avatar -->
              <Avatar
                alt={message.role === 'user' ? 'You' : 'AI'}
                size="md"
                shape="rounded"
              />

              <!-- Message Content -->
              <div class="flex flex-col {message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]">
                <Card class="p-3 {message.role === 'user' ? 'bg-[var(--bg-secondary)] border-l-4 border-l-[var(--accent-cyan)]' : 'bg-[var(--bg-tertiary)]'}">
                  <p class="text-[var(--text-primary)] whitespace-pre-wrap">{message.content}</p>
                  {#if message.status === 'sending'}
                    <span class="text-xs text-[var(--text-secondary)] mt-1">Sending...</span>
                  {:else if message.status === 'failed'}
                    <span class="text-xs text-red-500 mt-1">Failed to send</span>
                  {/if}
                </Card>
                <span class="text-xs text-[var(--text-secondary)] mt-1 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          {/each}

          <!-- Loading Indicator -->
          {#if isLoading || isStreaming}
            <div class="flex gap-3">
              <Avatar alt="AI" size="md" />
              <div class="flex items-center gap-1 p-3 bg-[var(--bg-tertiary)] rounded">
                <span class="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce"></span>
                <span class="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                <span class="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              </div>
            </div>
          {/if}
        {/if}
      </div>

      <!-- Input Area -->
      <div class="border-t border-[var(--border)] p-4 bg-[var(--bg-primary)]">
        <div class="flex gap-2 max-w-4xl mx-auto">
          <Input
            placeholder="Type your message..."
            bind:value={inputValue}
            on:keypress={handleKeyPress}
            disabled={isLoading || isStreaming}
            />
          <Button
            variant="primary"
            on:click={handleSend}
            disabled={!inputValue.trim() || isLoading || isStreaming}
            loading={isLoading || isStreaming}
          >
            Send
          </Button>
        </div>
        <p class="text-xs text-[var(--text-secondary)] text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for messages */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 9999px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }
</style>
