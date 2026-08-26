/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nlams: {
          navy: '#071426',
          saffron: '#f97316',
          green: '#059669',
          blue: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
