/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Scans the main HTML file
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS, JSX, TS, and TSX files in src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

