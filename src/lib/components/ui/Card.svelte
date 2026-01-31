<script lang="ts">
  // Props
  export let padding: 'sm' | 'md' | 'lg' = 'md'
  export let shadow: 'none' | 'sm' | 'md' | 'lg' = 'sm'
  export let border = true
  export let rounded = true
  export let hover = false

  // Class builders
  $: paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  $: shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }

  $: classes = `
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${border ? 'border border-gray-200' : ''}
    ${rounded ? 'rounded-md' : ''}
    bg-white
    ${hover ? 'transition-shadow duration-200 hover:shadow-lg' : ''}
  `
</script>

<div class={classes}>
  <slot />
</div>