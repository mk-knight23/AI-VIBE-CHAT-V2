<script lang="ts">
  // Import components for demo
  import Button from './Button.svelte'
  import Input from './Input.svelte'
  import Card from './Card.svelte'
  import ScrollArea from './ScrollArea.svelte'
  import Avatar from './Avatar.svelte'
  import Badge from './Badge.svelte'
  import Separator from './Separator.svelte'

  // Demo state
  let inputValue = ''
  let count = 0
</script>

<div class="max-w-4xl mx-auto p-6 space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold mb-2">UI Components Demo</h1>
    <p class="text-gray-600">Minimalist Light with Neon Accents theme</p>
  </div>

  <!-- Button Section -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Buttons</h2>
    <div class="space-y-4">
      <div class="flex gap-3">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
      <div class="flex gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <Button fullWidth fullWidth={true}>Full Width Button</Button>
    </div>
  </Card>

  <!-- Input Section -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Inputs</h2>
    <div class="space-y-4">
      <Input placeholder="Enter your name..." label="Name" bind:value />
      <Input placeholder="Email address" type="email" label="Email" required />
      <Input placeholder="Password" type="password" label="Password" error />
      <Input placeholder="Search..." type="search" />
      <Input disabled placeholder="Disabled input" />
    </div>
  </Card>

  <!-- Avatar Section -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Avatars</h2>
    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <Avatar alt="John Doe" size="sm" />
        <Avatar alt="Jane Smith" size="md" />
        <Avatar alt="Alex Johnson" size="lg" />
        <Avatar alt="Sam Wilson" size="xl" />
      </div>
      <div class="flex gap-4 items-center">
        <Avatar alt="John Doe" shape="square" size="md" />
        <Avatar src="https://via.placeholder.com/40" alt="Image" size="md" />
        <Avatar fallback="icon" size="md" />
      </div>
      <div class="flex gap-4 items-center">
        <Avatar alt="Online User" status="online" size="md" />
        <Avatar alt="Away User" status="away" size="md" />
        <Avatar alt="Busy User" status="busy" size="md" />
        <Avatar alt="Offline User" status="offline" size="md" />
      </div>
    </div>
  </Card>

  <!-- Badge Section -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Badges</h2>
    <div class="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  </Card>

  <!-- Separator Section -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Separators</h2>
    <div class="space-y-6">
      <Separator />
      <div class="flex justify-between">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Center</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
      <Separator spacing="lg" />
      <p class="text-gray-600">Text with large spacing above</p>
    </div>
  </Card>

  <!-- ScrollArea Section -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Scroll Area</h2>
    <ScrollArea height="200px" gap="sm">
      <div class="space-y-2">
        {#each Array(20) as _, i}
          <div class="p-3 bg-gray-50 rounded">
            <p class="text-sm">Item {i + 1} in scrollable container</p>
          </div>
        {/each}
      </div>
    </ScrollArea>
  </Card>

  <!-- Interactive Demo -->
  <Card>
    <h2 class="text-xl font-semibold mb-4">Interactive Demo</h2>
    <div class="space-y-4">
      <Input placeholder="Type to update counter..." bind:value on:input={(e) => count = e.detail.value.length} />
      <div>
        <p>Character count: <span class="font-mono">{count}</span></p>
      </div>
      <Button on:click={() => count = 0}>Reset Counter</Button>
    </div>
  </Card>

  <!-- Footer -->
  <Separator spacing="lg" />
  <p class="text-center text-gray-500 text-sm">
    All components follow the design system with sharp edges and neon accents
  </p>
</div>