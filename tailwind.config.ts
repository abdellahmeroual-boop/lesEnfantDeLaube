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
        // Palette de la page vitrine (équivalents sRGB des oklch d'origine)
        // `deep` : fond des sections à texte clair — le bleu principal est trop
        // lumineux pour porter du texte blanc de petite taille (contraste 3,5:1).
        ocean: { DEFAULT: "#1A95BF", soft: "#EAF5F9", deep: "#0E6A8C" },
        sun: { DEFAULT: "#F97315", soft: "#FDF0E1" },
        foreground: "#172033",
        border: "#E4E7EC",
        background: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-quicksand)", "ui-sans-serif", "sans-serif"],
        nunito: ["var(--font-nunito)", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
