/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B3F8C",
        darkPurple: "#4A3475",
        textPrimary: "#3A3551",
        textSecondary: "#8B8FA8",
        cardBg: "#F6F7FB",
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #5B3F8C, #6F8CCF)',
      },
      keyframes: {
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popUp: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        slideUpFade: 'slideUpFade 0.5s ease-out forwards',
        popUp: 'popUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}
