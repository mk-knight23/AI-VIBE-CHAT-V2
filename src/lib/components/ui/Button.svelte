<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  // Props
  export let variant: 'primary' | 'secondary' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let disabled = false
  export let loading = false
  export let type: 'button' | 'submit' | 'reset' = 'button'
  export let fullWidth = false

  const dispatch = createEventDispatcher()

  // Class builders
  $: baseClasses = 'font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2'

  $: variantClasses = {
    primary: disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95',
    secondary: disabled
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95'
  }

  $: sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded',
    lg: 'px-6 py-3 text-lg rounded'
  }

  $: classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`

  // Events
  function handleClick(event: MouseEvent) {
    if (disabled || loading) return
    dispatch('click', event)
  }
</script>

<button
  {type}
  class={classes}
  disabled={disabled || loading}
  on:click={handleClick}
  aria-disabled={disabled || loading}
>
  {#if loading}
    <span class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </span>
  {:else}
    <slot />
  {/if}
</button>