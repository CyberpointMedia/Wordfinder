/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ['./views/**/*.ejs','./public/styles/style.css'],
  },
  theme: {
    extend: {
      backgroundImage: {
        'background-gradient': 'linear-gradient(180deg, #FFF 0%, #E9F3FF 100%)',
    },
    boxShadow: {
        'custom': '0px 2px 4px -2px rgba(24, 39, 75, 0.12), 0px 4px 4px -2px rgba(24, 39, 75, 0.08)', // Corrected custom box shadow
    },
    },
  },
  plugins: [],
}