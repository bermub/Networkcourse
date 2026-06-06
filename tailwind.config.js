module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Noto Sans Thai", "system-ui", "sans-serif"]
      },
      colors: {
        cyber: {
          ink: "#071018",
          panel: "#0d1726",
          line: "#1d3a52",
          cyan: "#00e5ff",
          lime: "#c8ff4d",
          violet: "#7c5cff",
          rose: "#ff4d7d"
        }
      },
      boxShadow: {
        glow: "0 0 34px rgba(0, 229, 255, 0.28)"
      }
    }
  },
  plugins: []
};
