import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contents/**/*.md",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
