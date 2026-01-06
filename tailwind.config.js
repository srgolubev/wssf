/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js", "./preview/*.html", "./server-deploy/*.html"],
  theme: {
    extend: {
      colors: {
        background: '#242055',
        foreground: '#FFFFFF',
        primary: '#00E5FF',
        'primary-foreground': '#242055',
        accent: '#80DEEA',
        'accent-foreground': '#1A1A3D',
      },
      fontFamily: {
        sans: ['GothamPro', 'sans-serif'],
        display: ['MOSSPORT', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
