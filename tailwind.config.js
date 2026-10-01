/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#00205B',
          50: '#EDF0F7',
          100: '#D6DCEC',
          200: '#AEB9D9',
          300: '#8696C6',
          400: '#5D73B3',
          500: '#35509F',
          600: '#1C3680',
          700: '#13265E',
          800: '#0A1740',
          900: '#00205B',
          950: '#030B22',
        },
        teal: {
          DEFAULT: '#1CB5B0',
          50: '#EBFAF9',
          100: '#D2F3F1',
          200: '#A6E8E4',
          300: '#79DCD6',
          400: '#4DD1C8',
          500: '#1CB5B0',
          600: '#169390',
          700: '#107170',
          800: '#0B4F50',
          900: '#062D30',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F7FA',
          border: '#E3E7EE',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 23, 64, 0.06)',
      },
      borderRadius: {
        md: '0.5rem',
      },
    },
  },
  plugins: [],
}
