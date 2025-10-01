/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#667eea",
          50: "#f0f4ff",
          100: "#e0e7ff",
          500: "#667eea",
          600: "#5a67d8",
          700: "#4c51bf",
        },
        secondary: {
          DEFAULT: "#764ba2",
          50: "#faf5ff",
          100: "#f3e8ff",
          500: "#764ba2",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        success: {
          DEFAULT: "#48bb78",
          50: "#f0fff4",
          100: "#c6f6d5",
          500: "#48bb78",
          600: "#38a169",
          700: "#2f855a",
        },
        error: {
          DEFAULT: "#f56565",
          50: "#fed7d7",
          100: "#feb2b2",
          500: "#f56565",
          600: "#e53e3e",
          700: "#c53030",
        },
        background: "#F5F7FA",
        text: "#2d3748",
      },
    },
  },
  plugins: [],
};
