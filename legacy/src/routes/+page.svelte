<script lang="ts">
  import { chatStore } from '$lib/stores/chatStore';
  import { settingsStore } from '$lib/stores/settingsStore';
  import { getProvider } from '$lib/providers/registry';
  import { Bot, Send, Trash2, Settings, User, Copy, Check } from 'lucide-svelte';

  let inputValue = $state('');
  let isLoading = $state(false);
  let messagesContainer: HTMLElement;
  let copiedId = $state<string | null>(null);

  let provider = $derived(getProvider($settingsStore.selectedProvider));
  let model = $derived(provider?.models.find(m => m.id === $settingsStore.selectedModel));
  let canSend = $derived(inputValue.trim().length > 0 && !isLoading);

  $effect(() => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });

  async function handleSubmit() {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    inputValue = '';
    isLoading = true;

    chatStore.addMessage({ role: 'user', content: userMessage });
    const assistantId = chatStore.addMessage({ role: 'assistant', content: '' });

    try {
      const settings = settingsStore.getSettings($settingsStore.selectedProvider);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: $chatStore.messages,
          provider: $settingsStore.selectedProvider,
          model: $settingsStore.selectedModel,
          config: settings
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader?.read() ?? { done: true, value: undefined };
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) chatStore.updateMessage(assistantId, content);
            } catch {}
          }
        }
      }
    } catch (error) {
      chatStore.updateMessage(assistantId, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      isLoading = false;
    }
  }

  function clearMessages() {
    chatStore.clearMessages();
  }

  async function copyToClipboard(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    copiedId = id;
    setTimeout(() => copiedId = null, 2000);
  }

  function openSettings() {
    alert('Settings dialog coming soon! For now, edit localStorage directly.');
  }
</script>

<svelte:head>
  <title>AI-VIBE Chat</title>
</svelte:head>

<div class="flex flex-col h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg">
          <Bot class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">AI Chat</h1>
          <p class="text-xs text-gray-500">
            {provider?.name || 'Select Provider'} • {model?.name || 'Select Model'}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          onclick={openSettings}
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings class="w-5 h-5" />
        </button>
        <button
          onclick={clearMessages}
          disabled={$chatStore.messages.length === 0}
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  <!-- Messages -->
  <div class="flex-1 overflow-y-auto p-4" bind:this={messagesContainer}>
    <div class="max-w-4xl mx-auto">
      {#if $chatStore.messages.length === 0}
        <!-- Welcome Screen -->
        <div class="text-center py-12">
          <div class="inline-block p-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl mb-6">
            <Bot class="w-16 h-16 text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-3">
            How can I help you today?
          </h2>
          <p class="text-gray-600 mb-8">
            Using {provider?.name || 'AI provider'} with {model?.name || 'AI model'}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {#each [
              { emoji: '💻', title: 'Code Assistant', desc: 'Get help with programming' },
              { emoji: '📝', title: 'Writing Help', desc: 'Improve your writing' },
              { emoji: '🧠', title: 'Problem Solving', desc: 'Break down complex problems' },
              { emoji: '📚', title: 'Learning', desc: 'Learn new concepts' }
            ] as item}
              <div class="p-4 bg-white rounded-xl text-left hover:shadow-md hover:border-l-4 hover:border-l-cyan-400 transition-all cursor-pointer border border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-1">
                  {item.emoji} {item.title}
                </h3>
                <p class="text-sm text-gray-600">{item.desc}</p>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <!-- Messages -->
        {#each $chatStore.messages as message (message.id)}
          <div class="group flex gap-4 mb-6">
            <div class="w-8 h-8 mt-1 flex-shrink-0 rounded-full flex items-center justify-center {message.role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' : 'bg-gray-100 border border-gray-200'}">
              {#if message.role === 'user'}
                <User class="w-4 h-4 text-white" />
              {:else}
                <Bot class="w-4 h-4 text-gray-700" />
              {/if}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold text-sm text-gray-900">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </span>
                {#if message.role === 'assistant' && message.content}
                  <button
                    onclick={() => copyToClipboard(message.content, message.id)}
                    class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-gray-700"
                  >
                    {#if copiedId === message.id}
                      <Check class="w-4 h-4 text-green-600" />
                    {:else}
                      <Copy class="w-4 h-4" />
                    {/if}
                  </button>
                {/if}
              </div>

              <div class="text-gray-700 whitespace-pre-wrap bg-white rounded-r-lg rounded-bl-lg p-4 shadow-sm border {message.role === 'user' ? 'border-l-4 border-l-cyan-400 border-y border-r border-gray-200' : 'border-gray-200'}">
                {@html message.content}
              </div>
            </div>
          </div>
        {/each}
      {/if}

      <!-- Loading Indicator -->
      {#if isLoading}
        <div class="flex gap-4 mb-6">
          <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Bot class="w-4 h-4 text-gray-500" />
          </div>
          <div class="flex gap-1 items-center">
            <span class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Input -->
  <div class="bg-white border-t border-gray-200 p-4">
    <div class="max-w-4xl mx-auto">
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex gap-3">
        <input
          type="text"
          bind:value={inputValue}
          placeholder="Type your message..."
          disabled={isLoading}
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSend}
          class="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Send class="w-4 h-4" />
          Send
        </button>
      </form>
      <p class="text-xs text-gray-500 mt-2 text-center">
        AI can make mistakes. Using {provider?.name || 'AI provider'} • {model?.name || 'AI model'}
      </p>
    </div>
  </div>
</div>
