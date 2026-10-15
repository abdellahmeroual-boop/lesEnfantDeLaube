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
        // Palette de la page vitrine : conversion sRGB exacte des oklch de
        // Lovable, mesurée sur lesenfantsdelaube.be (ses commentaires « #1A95BF »
        // et « #F97315 » sont approximatifs).
        ocean: { DEFAULT: "#01A2C5", soft: "#DDF7FF" },
        sun: { DEFAULT: "#FE7222", soft: "#FFEDCE" },
        foreground: "#001C2F",
        border: "#DFE6EB",
        background: "#FFFFFF",
      },
      // Valeurs Tailwind v3 par défaut, sauf sous `.vitrine` (globals.css) qui
      // reprend l'échelle de Lovable.
      borderRadius: {
        sm: "var(--radius-sm, 0.125rem)",
        md: "var(--radius-md, 0.375rem)",
        lg: "var(--radius-lg, 0.5rem)",
        xl: "var(--radius-xl, 0.75rem)",
        "2xl": "var(--radius-2xl, 1rem)",
        "3xl": "var(--radius-3xl, 1.5rem)",
      },
      boxShadow: {
        sm: "var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
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
