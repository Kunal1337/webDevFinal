/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c57b39',
        primaryDark: '#a9652c',
        brandNavy: '#002147',
        accent: '#646cff',
        darkBg: '#0f1a33',
        darkCard: '#1a2847',
      }
    }
  },
  plugins: [],
}
