/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eefaf6",
          100: "#d6f2e8",
          200: "#ade5d3",
          300: "#7bd0b8",
          400: "#49b498",
          500: "#28987e",
          600: "#1b7a67",
          700: "#186253",
          800: "#174e44",
          900: "#153f39",
          950: "#08231f",
        },
        accent: {
          50: "#fff8e8",
          100: "#ffedc2",
          200: "#ffd985",
          300: "#ffbf47",
          400: "#ffa71c",
          500: "#f98607",
          600: "#dd6402",
          700: "#b74506",
          800: "#94360c",
          900: "#7a2d0d",
        },
        ink: {
          50: "#f4f6f6",
          100: "#e3e8e7",
          200: "#c8d1cf",
          300: "#a2b0ad",
          400: "#758784",
          500: "#5a6c69",
          600: "#485755",
          700: "#3c4846",
          800: "#333c3b",
          900: "#1c2322",
        },
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(20, 30, 28, 0.06), 0 1px 3px 0 rgba(20, 30, 28, 0.08)",
      },
    },
  },
  plugins: [],
};
