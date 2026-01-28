import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        brand: "#f97316",
        accent: "#1d4ed8",
      },
      boxShadow: {
        card: "0 14px 40px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
