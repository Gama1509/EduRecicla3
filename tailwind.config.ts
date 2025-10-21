import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#1E90FF",
        },
        green: {
          DEFAULT: "#32CD32",
        },
        orange: {
          DEFAULT: "#FFA500",
        },
      },
    },
  },
  plugins: [],
};
export default config;
