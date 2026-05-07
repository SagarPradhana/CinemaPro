/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08060F",
        accent: {
          violet: "#5C3BFE",
          pink: "#FF2D78",
          gold: "#C9A84C",
        },
        surface: "#1A1625",
        "text-primary": "#FFFFFF",
        "text-muted": "#A1A1AA",
        border: "rgba(255,255,255,0.1)",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "3xl": "24px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(92, 59, 254, 0.3)",
      },
    },
  },
  plugins: [],
}