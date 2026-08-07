/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          soft: '#6E6E6B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FAFAF8',
          sunken: '#F0EFEA',
        },
        line: {
          DEFAULT: '#E4E2DB',
          strong: '#111111',
        },
        brand: {
          50: '#EEF3FC',
          100: '#D6E4F8',
          300: '#8FB4EA',
          500: '#1D4ED8',
          600: '#1741B0',
          700: '#11337F',
        },
        deal: {
          up: '#B42318',   // prix en hausse
          down: '#1D7A46', // prix en baisse (bonne affaire)
        },
        grade: {
          neuf: '#111111',
          a: '#1D4ED8',
          b: '#946200',
          c: '#6E6E6B',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
