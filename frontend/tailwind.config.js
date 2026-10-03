/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eaf6ec',
          100: '#c9e8cd',
          200: '#a0d6a7',
          300: '#6fc07a',
          400: '#47a856',
          500: '#2E7D32', // primary
          600: '#276b2b',
          700: '#1f5723',
          800: '#17421b',
          900: '#0f2e12',
        },
        clay: {
          400: '#f0985a',
          500: '#E8792E', // accent orange
          600: '#c96322',
        },
        ink: {
          900: '#0d1310',
          800: '#141b17',
          700: '#1c2621',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Sora"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 46, 18, 0.15)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        flow: 'flow 3s ease-in-out infinite',
        floatUp: 'floatUp 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
