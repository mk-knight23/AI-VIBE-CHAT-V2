<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  // Props
  export let variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'default'
  export let size: 'sm' | 'md' = 'md'
  export let rounded = true
  export let pulse = false
  export let closable = false
  export let closed = false

  const dispatch = createEventDispatcher()

  // Events
  function handleClose() {
    dispatch('close')
  }

  // Class builders
  $: variantClasses = {
    default: 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-300',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200'
  }

  $: sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  }

  $: classes = `
    inline-flex items-center gap-1
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${pulse ? 'animate-pulse' : ''}
    transition-all duration-200
  `

  // Render content with close button
  function renderContent() {
    if (closed) {
      return null
    }

    return `
      <span class="inline-flex items-center gap-1">
        <slot />
        {#if closable}
          <button
            on:click={handleClose}
            class="hover:opacity-60 transition-opacity"
            aria-label="Remove badge"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        {/if}
      </span>
    `
  }
</script>

{#if !closed}
  <div class={classes} role="status">
    {@html renderContent()}
  </div>
{/if}