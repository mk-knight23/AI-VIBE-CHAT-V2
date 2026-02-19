import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['tests/unit/**/*.{test,spec}.{ts,js}'],
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        'src/routes/+layout.svelte',
        'src/lib/components/ui/'
      ]
    }
  },
  resolve: {
    alias: {
      $lib: '/src/lib',
      $components: '/src/lib/components'
    }
  }
})
