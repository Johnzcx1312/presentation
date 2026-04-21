/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5b21b6',
          light: '#7c3aed',
          dark: '#4c1d95',
          50: '#f3f0ff',
          100: '#ede9fe',
          200: '#ddd6fe',
        },
        sidebar: {
          start: '#4c1d95',
          middle: '#5b21b6',
          end: '#7c3aed',
        },
        background: '#f8f7fc',
      }
    },
  },
  plugins: [],
}
