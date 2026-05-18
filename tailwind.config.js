/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0faf2',
          100: '#d9f2de',
          200: '#b5e5bf',
          300: '#7fd196',
          400: '#47b566',
          500: '#259945',
          600: '#1a7a36',
          700: '#16622c',
          800: '#154e26',
          900: '#124121',
          950: '#082410',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.08)',
        'nav':  '0 -2px 20px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
