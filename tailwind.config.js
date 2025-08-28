/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
  // Preserve common color aliases so utilities like `bg-white`/`text-black` still work
  white: '#ffffff',
  black: '#000000',
        primary: {
          50: '#fef7f7',
          100: '#feecec',
          200: '#fddada',
          300: '#fbc0c0',
          400: '#f89191',
          500: '#ec5858', // Original primary
          600: '#d64f4f',
          700: '#b34242',
          800: '#903535',
          900: '#772c2c',
        },
        secondary: {
          50: '#f7fbfd',
          100: '#eef6fc',
          200: '#dbeefa',
          300: '#c0e0f7',
          400: '#91c9f0',
          500: '#58a0ec', // Original secondary
          600: '#4f90d6',
          700: '#427bb3',
          800: '#356290',
          900: '#2c5177',
        },
        accent: {
          50: '#f7fef9',
          100: '#eefdf2',
          200: '#dcfbe4',
          300: '#c0f7d0',
          400: '#91f0ae',
          500: '#58ec90', // Original accent
          600: '#4fd682',
          700: '#42b36d',
          800: '#359057',
          900: '#2c7747',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0d14',
        },
        dark: '#242424',
        light: '#ffffff',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        border: '#e5e7eb', // gray-200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
