import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Les Enfants de l'Aube",
  description:
    "Cours de natation et stages vacances pour enfants — inscriptions en ligne.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
