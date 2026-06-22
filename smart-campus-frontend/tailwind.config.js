/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f0f3f9',
          100: '#dce3f0',
          200: '#b9c7e0',
          300: '#8fa3c9',
          400: '#5d77a8',
          500: '#3a5180',
          600: '#283c64',
          700: '#1d2c4a',
          800: '#141f36',
          900: '#0c1422',
        },
        amber: {
          50: '#fdf6ec',
          100: '#faebcf',
          200: '#f3d49b',
          300: '#ebb85f',
          400: '#e09f35',
          500: '#c98620',
          600: '#a76b18',
          700: '#825016',
          800: '#5e3a14',
        },
        parchment: '#f7f4ec',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Georgia"', 'serif'],
        body: ['"Inter"', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,20,34,0.04), 0 4px 16px rgba(12,20,34,0.06)',
      },
    },
  },
  plugins: [],
}
