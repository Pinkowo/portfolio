import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        space: {
          bg: '#030308',
          'nav-bg': '#03030B',
          traj: '#0D1B3E',
        },
        rocket: {
          body: '#F1F5F9',
          'body-final': '#F8FAFC',
          wings: '#CBD5E1',
          'wings-final': '#E2E8F0',
          window: '#06B6D4',
          flame: '#F97316',
          'flame-core': '#FDE68A',
        },
        planet: {
          earth: '#1B4FAD',
          saturn: '#E8C97C',
          moon: '#94A3B8',
          jupiter: '#C17F3E',
          mars: '#C1440E',
          neptune: '#3B5BDB',
          uranus: '#7C3AED',
        },
        sun: {
          body: '#FCD34D',
          glow: '#FBBF24',
          corona: '#B45309',
          'corona-outer': '#7C2D04',
          highlight: '#FEF3C7',
        },
        hover: {
          divider: '#1B3A6E',
          cta: '#1B4FAD',
        },
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'pulse-glow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
