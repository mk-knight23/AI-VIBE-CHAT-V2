<script lang="ts">
  // Props
  export let src: string | null = null
  export let alt = ''
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
  export let shape: 'circle' | 'square' = 'circle'
  export let fallback: 'initials' | 'icon' | 'user' | 'bot' = 'initials'
  export let status?: 'online' | 'offline' | 'away' | 'busy'
  export let statusColor: string = '#00d9ff'

  // State
  let imageError = false
  let initials: string

  // Calculate initials from name
  $: {
    if (alt && fallback === 'initials') {
      const words = alt.trim().split(/\s+/)
      if (words.length >= 2) {
        initials = words[0][0].toUpperCase() + words[1][0].toUpperCase()
      } else {
        initials = alt.trim().substring(0, 2).toUpperCase()
      }
    }
  }

  // Image loading error
  function handleImageError() {
    imageError = true
  }

  // Class builders
  $: sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }

  $: shapeClasses = shape === 'circle'
    ? 'rounded-full'
    : 'rounded-md'

  $: avatarClasses = `${sizeClasses[size]} ${shapeClasses} overflow-hidden bg-gray-100 flex items-center justify-center relative`

  // Status indicator
  function renderStatusIndicator() {
    if (!status) return null

    return `<div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
            style="background-color: ${statusColor}"></div>`
  }
</script>

<div class={avatarClasses}>
  {#if src && !imageError}
    <img
      {src}
      {alt}
      on:error={handleImageError}
      class="w-full h-full object-cover"
      loading="lazy"
    />
  {:else if fallback === 'icon'}
    <svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
    </svg>
  {:else if fallback === 'user'}
    <svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
    </svg>
  {:else if fallback === 'bot'}
    <svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  {:else}
    <span class="font-medium text-gray-600">{initials}</span>
  {/if}
</div>

{@html renderStatusIndicator()}