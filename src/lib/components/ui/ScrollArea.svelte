<script lang="ts">
  import { onMount } from 'svelte'

  // Props
  export let height: 'auto' | 'full' | string = 'auto'
  export let width: 'auto' | 'full' | string = 'auto'
  export let scrollbars: 'vertical' | 'horizontal' | 'both' | 'none' = 'both'
  export let gap = 'sm'
  export let padding = 'md'

  // Refs
  let scrollContainer: HTMLDivElement
  let scrollbarThumb: HTMLDivElement

  // State
  let isScrolling = false
  let scrollTimeout: number

  // Scrollbar visibility
  function showScrollbar() {
    isScrolling = true
    clearTimeout(scrollTimeout)
    scrollTimeout = window.setTimeout(() => {
      isScrolling = false
    }, 1000)
  }

  // Smooth scroll
  function smoothScrollToTop() {
    if (!scrollContainer) return
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Expose scroll container
  $$props = { scrollContainer }

  // Cleanup
  onDestroy(() => {
    clearTimeout(scrollTimeout)
  })
</script>

<div
  bind:this={scrollContainer}
  class={`
    overflow-hidden
    ${height === 'full' ? 'h-full' : typeof height === 'string' ? `h-[${height}]` : ''}
    ${width === 'full' ? 'w-full' : typeof width === 'string' ? `w-[${width}]` : ''}
    relative
  `}
  on:scroll={showScrollbar}
>
  <div
    class={`
      h-full
      ${gap === 'sm' ? 'gap-2' : gap === 'md' ? 'gap-4' : gap === 'lg' ? 'gap-6' : ''}
      ${padding === 'sm' ? 'p-2' : padding === 'md' ? 'p-4' : padding === 'lg' ? 'p-6' : ''}
    `}
  >
    <slot />
  </div>

  {/* Scrollbar */}
  {#if scrollbars === 'vertical' || scrollbars === 'both'}
    <div
      class={`
        absolute top-0 right-0 bottom-0 w-1.5 transition-opacity duration-300
        ${isScrolling ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        bind:this={scrollbarThumb}
        class="w-full h-full bg-gray-300 rounded-full group-hover:bg-cyan-500 transition-colors"
        style="transform: translateY(var(--scroll-y));"
      />
    </div>
  {/if}

  {/* Scroll-to-top button */}
  {#if scrollContainer && scrollContainer.scrollTop > 100}
    <button
      on:click={smoothScrollToTop}
      class="absolute bottom-4 right-4 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      aria-label="Scroll to top"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  {/if}
</div>

<style>
  div[bind:this]::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  div[bind:this]::-webkit-scrollbar-track {
    background: transparent;
  }

  div[bind:this]::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 9999px;
    transition: background 0.2s;
  }

  div[bind=this]::-webkit-scrollbar-thumb:hover {
    background: #00d9ff;
  }

  div[bind:this]::-webkit-scrollbar-corner {
    background: transparent;
  }
</style>