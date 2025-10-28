/** @type {import('@tailwindcss/vite').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        open: "#22c55e", // Green
        in_progress: "#f59e0b", // Amber
        closed: "#ef4444", // Red
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
