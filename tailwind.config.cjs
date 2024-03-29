/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'bounce-right': 'bounce-right 1s infinite',
        'bounce-left': 'bounce-left 1s infinite',
        'skeleton-loading': 'skeleton-loading 1s linear infinite alternate',
      },
      scale: {
        101: '1.01',
      },
      boxShadow: {
        'inner-lg': 'inset 0 0px 10px 2px rgba(0, 0, 0, 0.1)',
        'custom-lg': '4px 5px 10px 2px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        'bounce-right': {
          '0%, 100%': {
            transform: 'none',
            'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
          },
          '50%': {
            transform: 'translateX(30%)',
            'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
          },
        },
        'bounce-left': {
          '0%, 100%': {
            transform: 'none',
            'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
          },
          '50%': {
            transform: 'translateX(-30%)',
            'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
          },
        },
        'skeleton-loading': {
          '0%': {
            opacity: '20%',
          },
          '100%': {
            opacity: '5%',
          },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
