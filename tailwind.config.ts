import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-card': '#1a1a26',
        'accent': '#6366f1',
        'kr-accent': '#38bdf8',
        'text-primary': '#e8e8f0',
        'text-secondary': '#9898b0',
      },
      fontFamily: {
        sans: ['Outfit', 'IBM Plex Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
