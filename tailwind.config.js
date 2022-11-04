/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'PublicSans': ['"public sans"', 'sans-serif'],
      'PTSansNarrow': ['"PT Sans Narrow"', 'sans-serif'],
      'Inter': ['"Inter"', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}
