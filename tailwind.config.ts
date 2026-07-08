import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique Les Enfants de l'Aube — orange principal #C0521A
        aube: {
          50: "#FDF5F0",
          100: "#FAE7DB",
          200: "#F4CCB3",
          300: "#ECAB84",
          400: "#E28353",
          500: "#D06630",
          600: "#C0521A",
          700: "#9E4315",
          800: "#7E3612",
          900: "#662C10",
          950: "#371608",
          DEFAULT: "#C0521A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
