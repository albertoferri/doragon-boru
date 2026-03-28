/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          yellow: '#eab308',
        }
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(59,130,246,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(59,130,246,0.4)' },
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
