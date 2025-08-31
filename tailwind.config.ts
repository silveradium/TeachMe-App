import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "Noto Sans",
      },
      colors: {
        primary: {
          100: "#fee2e2",
          300: "#fca5a5",
          500: "#E82530",
          700: "#D8242E",
          900: "#8A0909",
        },
        secondary: "#F2DFE4",
        tertiary: "#EDE9E9",
        light: "#FFFFFF",
        dark: "#2B2A2A",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.35s cubic-bezier(.21,1.02,.73,1)",
      },
      keyframes: {
        "checkbox-wave": {
          "50%": { transform: "scale(0.9)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
} satisfies Config;
