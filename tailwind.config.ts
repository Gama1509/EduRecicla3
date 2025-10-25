import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1E90FF', // Blue
          dark: '#32CD32', // Green
        },
        secondary: {
          light: '#32CD32', // Green
          dark: '#1E90FF', // Blue
        },
        accent: {
          light: '#FFA500', // Orange
          dark: '#FFA500', // Orange
        },
        background: {
          light: '#E8FBD7', // Pistachio
          dark: '#121212',
        },
        card: {
          light: '#E8FBD7', // Pistachio
          dark: '#1E1E1E',
        },
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        border: {
          light: '#E0E0E0',
          dark: '#333333',
        },
      },
    },
  },
  plugins: [],
};

export default config;
