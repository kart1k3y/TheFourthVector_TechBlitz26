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
      }
    },
  },
  plugins: [],
}
