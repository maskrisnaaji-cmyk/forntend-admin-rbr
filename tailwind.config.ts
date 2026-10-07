import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: '#5E1626',
          'maroon-light': '#802135',
          cream: '#FAF6F0',
          'cream-card': '#F7F2EB',
          'cream-accent': '#E8DFD5',
          gold: '#C59A3F',
          text: '#2D2D2D',
          muted: '#78726D',
        }
      }
    },
  },
  plugins: [],
};
export default config;