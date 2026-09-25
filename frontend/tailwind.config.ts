import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#eef3f8",
          100: "#d7e3ef",
          200: "#b0c7df",
          300: "#7fa3c8",
          400: "#4d7cab",
          500: "#325f8c",
          600: "#254a70",
          700: "#1c3a58",
          800: "#152c43",
          900: "#0f2033",
          950: "#0a1522",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 32 51 / 0.06), 0 1px 2px -1px rgb(15 32 51 / 0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
