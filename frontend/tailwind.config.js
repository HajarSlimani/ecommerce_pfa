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
      boxShadow: {
        // Élévation très subtile réservée à l'admin : le catalogue client
        // reste 100% hairline/plat, mais le panel admin peut se permettre
        // un soupçon de profondeur pour hiérarchiser les cartes de data.
        'admin-sm': '0 1px 2px 0 rgba(17,17,17,0.04)',
        'admin-md': '0 2px 8px -2px rgba(17,17,17,0.08), 0 1px 2px -1px rgba(17,17,17,0.04)',
        'admin-lg': '0 12px 32px -8px rgba(17,17,17,0.12)',
      },
    },
  },
  plugins: [],
}
