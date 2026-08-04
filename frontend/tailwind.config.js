/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101828',
          soft: '#344054',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F7F5',
          sunken: '#EEF0EC',
        },
        brand: {
          50: '#EEFBF7',
          100: '#D2F4E9',
          300: '#7FD9BE',
          500: '#0F766E',
          600: '#0C5F58',
          700: '#0A4A45',
        },
        deal: {
          up: '#DC2626',   // prix en hausse
          down: '#16A34A', // prix en baisse (bonne affaire)
        },
        grade: {
          neuf: '#0F766E',
          a: '#2563EB',
          b: '#D97706',
          c: '#78716C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
