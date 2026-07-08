/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#4f6ef7",
          600: "#3b5be0",
          700: "#2f47b8",
        },
      },
    },
  },
  plugins: [],
};
