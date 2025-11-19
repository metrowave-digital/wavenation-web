/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /* ----------------------------------------------
       *  FONT FAMILIES
       * ---------------------------------------------- */
      fontFamily: {
        fira: ["var(--font-fira-sans)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        oswald: ["var(--font-oswald)", "sans-serif"],
        merriweather: ["var(--font-merriweather)", "serif"],
      },

      /* ----------------------------------------------
       *  WAVENATION COLOR SYSTEM
       * ---------------------------------------------- */
      colors: {
        // DARK
        "wn-black": "#181D1F",
        "wn-black-light": "#1E2426",
        "wn-gray": "#D7DEDC",
        "wn-red": "#B0343C",
        "wn-amber": "#CF873D",
        "wn-gold": "#E4B500",

        // LIGHT
        "wn-bg-light": "#FFFFFF",
        "wn-text-light": "#1E2426",
        "wn-gray-light": "#F2F5F4",
        "wn-red-light": "#C8464E",
        "wn-amber-light": "#E39A4D",
        "wn-gold-light": "#F0C200",

        // NEON ACCENTS
        electric: "#00B3FF",
        magenta: "#E92C63",
        neon: "#39FF14",
      },

      /* ----------------------------------------------
       *  SHADOWS
       * ---------------------------------------------- */
      boxShadow: {
        gold: "0 0 20px rgba(228, 181, 0, 0.35)",
        red: "0 0 20px rgba(176, 52, 60, 0.35)",
        amber: "0 0 20px rgba(207, 135, 61, 0.35)",
      },

      /* ----------------------------------------------
       *  KEYFRAMES (Ticker, Bokeh, Flyouts, Neon, etc.)
       * ---------------------------------------------- */
      keyframes: {
        /* News Ticker Crawl */
        crawl: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },

        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },

        flyoutFade: {
          "0%": { opacity: 0, transform: "translateX(-4px) scale(0.96)" },
          "100%": { opacity: 1, transform: "translateX(0) scale(1)" },
        },

        neonPulse: {
          "0%, 100%": { opacity: 0.55 },
          "50%": { opacity: 1 },
        },

        wave: {
          "0%": { transform: "translateX(-25%) skewX(-8deg)" },
          "50%": { transform: "translateX(0%) skewX(-4deg)" },
          "100%": { transform: "translateX(25%) skewX(-8deg)" },
        },

        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },

        bokehFloat: {
          "0%": { transform: "translateY(0) scale(1)", opacity: 0.4 },
          "50%": { transform: "translateY(-30px) scale(1.1)", opacity: 0.7 },
          "100%": { transform: "translateY(0) scale(1)", opacity: 0.4 },
        },
      },

      /* ----------------------------------------------
       *  ANIMATIONS
       * ---------------------------------------------- */
      animation: {
        // CRAWL SPEEDS
        crawl: "crawl 22s linear infinite",
        crawlSlow: "crawl 35s linear infinite",

        fadeIn: "fadeIn 0.22s ease-out forwards",
        flyoutFade: "flyoutFade 0.20s ease-out forwards",
        neonPulse: "neonPulse 1.5s ease-in-out infinite",
        wave: "wave 18s ease-in-out infinite alternate",
        float: "float 8s ease-in-out infinite",
        bokehFloat: "bokehFloat 6s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
