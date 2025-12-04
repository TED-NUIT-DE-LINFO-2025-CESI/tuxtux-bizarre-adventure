/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tux-gold': '#FFD700',
        'windows-blue': '#00A4EF',
        'linux-green': '#77B829',
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
