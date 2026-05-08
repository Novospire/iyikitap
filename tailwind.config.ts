import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        mist: "#ffffff",
        brand: "#D92D20",
        "zinc-gray": "#d9d9d9",
        "sterling": "#6e6e6e",
        "cloud": "#e7e7e7",
        "editorial-yellow": "#ffc500",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        sans: [
          "'Helvetica Neue'",
          "Arial",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        editorial: "1296px",
      },
      letterSpacing: {
        "editorial-tight": "-0.02em",
        "editorial-heading": "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
