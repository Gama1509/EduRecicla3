import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          dark: '#22C55E',
          'dark-hover': '#4ADE80',
        },
        secondary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          dark: '#3B82F6',
          'dark-hover': '#60A5FA',
        },
        background: {
          light: '#FFFFFF',
          dark: '#0D1117',
        },
        card: {
          light: '#F5F5F5',
          dark: '#161B22',
        },
        text: {
          primary: {
            light: '#1E1E1E',
            dark: '#E6EDF3',
          },
          secondary: {
            light: '#4B5563',
            dark: '#9CA3AF',
          },
        },
        border: {
          light: '#E5E7EB',
          dark: '#30363D',
        },
        icon: {
          dark: '#D1D5DB',
        },
      },
    },
  },
  plugins: [],
};
export default config;
