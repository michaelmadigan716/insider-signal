import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'signal-green': '#00ff88',
        'signal-green-dark': '#00cc6a',
        'signal-cyan': '#00ddff',
        'signal-purple': '#da70d6',
        'signal-gold': '#ffc800',
        'signal-bg': '#0a0a0f',
        'signal-bg-light': '#0d1117',
        'signal-card': 'rgba(255,255,255,0.03)',
        'signal-border': 'rgba(255,255,255,0.06)',
        'signal-text': '#e6edf3',
        'signal-muted': '#7d8590',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-slide-in': 'fadeSlideIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
