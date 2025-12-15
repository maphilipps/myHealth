/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          primary: '#10b981',    // Emerald for health/fitness
          secondary: '#f59e0b',  // Amber for nutrition
          accent: '#06b6d4',     // Cyan for vitals
          dark: '#1f2937',
          light: '#f3f4f6',
        }
      }
    },
  },
  plugins: [],
}
