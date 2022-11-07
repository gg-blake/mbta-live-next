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
    extend: {
      gridTemplateColumns: {
        '100': 'repeat(100, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
