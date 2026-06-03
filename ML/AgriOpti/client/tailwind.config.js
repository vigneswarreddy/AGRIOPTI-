/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f2f9f1',
          100: '#e1f1de',
          200: '#c5e5be',
          300: '#9ed391',
          400: '#71ba5d',
          500: '#4fa13c',
          600: '#3c832e',
          700: '#326827',
          800: '#2a5323',
          900: '#24451f',
          950: '#0f260d',
        },
        earth: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#d0baae',
          400: '#b18f7d',
          500: '#9a735f',
          600: '#8c6454',
          700: '#755146',
          800: '#63453c',
          900: '#523b34',
          950: '#2b1c19',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

