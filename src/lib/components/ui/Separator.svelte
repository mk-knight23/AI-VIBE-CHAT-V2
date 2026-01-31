<script lang="ts">
  // Props
  export let orientation: 'horizontal' | 'vertical' = 'horizontal'
  export let spacing: 'none' | 'sm' | 'md' | 'lg' = 'md'
  export let decorative = true

  // Class builders
  $: spacingClasses = {
    none: '',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6'
  }

  $: spacingClassesVertical = {
    none: '',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6'
  }

  $: classes = orientation === 'horizontal'
    ? `w-full h-px bg-gray-200 ${spacingClasses[spacing]}`
    : `h-full w-px bg-gray-200 ${spacingClassesVertical[spacing]}`

  // ARIA attributes
  $: ariaOrientation = orientation
  $: ariaDecorative = decorative
</script>

<div
  class={classes}
  role={decorative ? 'separator' : undefined}
  aria-orientation={ariaOrientation}
  aria-hidden={decorative}
></div>