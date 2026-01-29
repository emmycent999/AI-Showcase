/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        veritas: {
          green: '#006838',
          dark: '#0a0f1c',
          blue: '#1e3a8a',
        },
        showcase: {
          blue: '#1a3c5e', // Dark blue from the flier headings
          cyan: '#00f7ff', // Neon cyan from the robot eye/accents
          dark: '#05070a', // Deep dark background
          gray: '#c0c0c0', // Silver/gray from the text
        },
        neon: {
          cyan: '#00f7ff',
          blue: '#2dd4bf',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
