/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        verdant: {
          light: '#eaf4ef', // Background
          dark: '#0f766e',  // Main Green
          accent: '#d1fae5', // Light green pill
          text: '#064e3b',   // Dark green text
          gray: '#f9fafb',   // Card background
        }
      },
      animation: {
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
