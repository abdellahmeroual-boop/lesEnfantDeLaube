import type { Metadata } from "next";
import { Inter, Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Polices de la page vitrine, exposées en variables CSS : le reste de
// l'application (catalogue, admin) reste en Inter.
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Les Enfants de l'Aube",
  description:
    "Cours de natation et stages vacances pour enfants — inscriptions en ligne.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${nunito.variable} ${quicksand.variable}`}>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
