import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#ffffff',
        'bg-secondary': '#f8fafc',
        'bg-tertiary': '#f1f5f9',
        'accent-cyan': '#00d9ff',
        'accent-purple': '#b829f7',
        'text-primary': '#0f172a',
        'text-secondary': '#64748b',
        'border': '#e2e8f0'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        '4px': '4px'
      }
    },
    customColors: {
      'bg-primary': '#ffffff',
      'bg-secondary': '#f8fafc',
      'bg-tertiary': '#f1f5f9',
      'accent-cyan': '#00d9ff',
      'accent-purple': '#b829f7',
      'text-primary': '#0f172a',
      'text-secondary': '#64748b',
      'border': '#e2e8f0'
    }
  }
} satisfies Config;