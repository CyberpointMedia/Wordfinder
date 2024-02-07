/** @type {import('tailwindcss').Config} */
module.exports = {
    // content: ['./node_modules/preline/dist/*.js',],
    content: ["./dist/views**/*.{html,js}", "./node_modules/preline/dist/*.js"],
    theme: {
        extend: {
            fontFamily: {
                custom: ['Roboto', 'sans-serif'], // Example using Google Font
            },
            backgroundColor: {
                buttonPrimary: '#007BFF'
            },
        },
    },
    plugins: [
        require('preline/plugin'),
    ],
};