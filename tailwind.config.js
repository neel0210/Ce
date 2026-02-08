/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        liquidDark: "#0f172a",
        examBlue: "#004a99",
        examGrey: "#e5e7eb",
      },
    },
  },
  plugins: [],
}