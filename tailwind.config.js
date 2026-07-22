/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14171F',
        canvas: '#F7F7F5',
        surface: '#FFFFFF',
        line: '#E4E4E0',
        muted: '#6B7280',
        brand: '#F0B429',
        signal: {
          now: '#D6472B',
          'now-bg': '#FBEAE6',
          soon: '#B4790F',
          'soon-bg': '#FBF1DE',
          later: '#3F6852',
          'later-bg': '#E9F1EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(20, 23, 31, 0.06), 0 1px 12px rgba(20, 23, 31, 0.04)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 150ms ease-out',
      },
    },
  },
  plugins: [],
}