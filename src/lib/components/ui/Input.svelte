<script lang="ts">
  import { onMount } from 'svelte'

  // Props
  export let value = ''
  export let placeholder = ''
  export let type: 'text' | 'email' | 'password' | 'search' | 'url' = 'text'
  export let disabled = false
  export let readonly = false
  export let required = false
  export let error = false
  export let label = ''
  export let helperText = ''

  // Refs
  let inputRef: HTMLInputElement

  // Focus management
  function focus() {
    inputRef?.focus()
  }

  function blur() {
    inputRef?.blur()
  }

  // Events
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    $$dispatch('input', { value: target.value })
  }

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement
    $$dispatch('change', { value: target.value })
  }

  function handleFocus(event: FocusEvent) {
    $$dispatch('focus', event)
  }

  function handleBlur(event: FocusEvent) {
    $$dispatch('blur', event)
  }

  function handleKeyPress(event: KeyboardEvent) {
    $$dispatch('keypress', event)
  }

  function handleKeyDown(event: KeyboardEvent) {
    $$dispatch('keydown', event)
  }

  function handleKeyUp(event: KeyboardEvent) {
    $$dispatch('keyup', event)
  }

  // Expose focus function
  $$props = { focus }
</script>

{#if label}
  <label class="block text-sm font-medium text-gray-700 mb-1.5">
    {label}
    {#if required}
      <span class="text-red-500 ml-1">*</span>
    {/if}
  </label>
{/if}

<div class="relative">
  <input
    bind:value
    {placeholder}
    {type}
    {disabled}
    {readonly}
    {required}
    {error}
    bind:this={inputRef}
    on:input={handleInput}
    on:change={handleChange}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:keypress={handleKeyPress}
    on:keydown={handleKeyDown}
    on:keyup={handleKeyUp}
    class={`
      w-full px-4 py-2.5 text-gray-900 bg-white border rounded-md
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200
      ${error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'
      }
    `}
    aria-invalid={error}
  />

  {#if helperText}
    <p class="mt-1.5 text-sm {error ? 'text-red-600' : 'text-gray-500'}">
      {helperText}
    </p>
  {/if}
</div>