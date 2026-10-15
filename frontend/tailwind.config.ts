import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dt: {
          bg: '#080c0b',
          panel: '#0e1513',
          panelAlt: '#131c1a',
          border: '#22312d',
          text: '#e4eeeb',
          muted: '#8ca7a0',
          accent: '#22c55e',
          accentSoft: '#34d399',
          teal: '#14b8a6',
          danger: '#ef4444',
          warning: '#f87171',
        },
      },
      boxShadow: {
        panel: '0 8px 30px rgba(0, 0, 0, 0.24)',
      },
      borderRadius: {
        panel: '0.875rem',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.95' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
