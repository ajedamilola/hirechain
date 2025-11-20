/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using class strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors
        pink: '#f100c3',
        cyan: '#25e5fa',
      },
      fontFamily: {
        sans: ["HankenGroteskMedium", "sans-serif"]
      }
    },
  },
  plugins: [],
}
