import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#181916",
        paper: "#f8f7f3",
        olive: "#5c6547",
        clay: "#b65d43",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 55px rgba(34, 36, 28, .09)",
      },
    },
  },
  plugins: [],
};

export default config;
