/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        electric: "#00B3FF",
        magenta: "#E92C63",
        neon: "#39FF14",
        darkbg: "#050505",
        darkcard: "#0F0F0F",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 179, 255, 0.6)",
        magenta: "0 0 20px rgba(233, 44, 99, 0.6)",
      },
      keyframes: {
        wave: {
          "0%": { transform: "translateX(-25%) skewX(-8deg)" },
          "50%": { transform: "translateX(0%) skewX(-4deg)" },
          "100%": { transform: "translateX(25%) skewX(-8deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        wave: "wave 18s ease-in-out infinite alternate",
        float: "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
