/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        accent: "#8b5cf6",
        background: "#0f172a",
        card: "rgba(30, 41, 59, 0.7)",
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
