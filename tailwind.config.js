/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF0ED',
          100: '#FFE0DB',
          200: '#FFC2B8',
          300: '#FF9E90',
          400: '#FF7A66',
          500: '#FF6347',
          600: '#E5503D',
          700: '#C23D30',
          800: '#A02F27',
          900: '#842521',
        },
        accent: {
          50: '#FFF8F0',
          100: '#FFEFE0',
          200: '#FFDDC0',
          300: '#FFC89D',
          400: '#FFAE76',
          500: '#FF9A52',
          600: '#E88545',
          700: '#C46C37',
          800: '#A3562E',
          900: '#874628',
        },
        warm: {
          50: '#FFFBF8',
          100: '#FFF5EE',
          200: '#FFE9DB',
          300: '#FFD9C2',
          400: '#FFC4A5',
          500: '#FFAC85',
          600: '#E8956F',
          700: '#C47A55',
          800: '#A36243',
          900: '#884E37',
        },
      },
    },
  },
  plugins: [],
};