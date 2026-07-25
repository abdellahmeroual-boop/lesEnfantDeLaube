import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
import { PHONE_TEL, EMAIL } from "@/lib/site";

const TITLE = "Cours de natation pour enfants à Namur | Les enfants de l'aube";
const DESCRIPTION =
  "Cours de natation ludiques et sécurisants pour enfants dès 4 ans à Namur. Groupes réduits, maîtres-nageurs diplômés. Inscrivez votre enfant en ligne.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Les enfants de l'aube ASBL" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Les enfants de l'aube",
    locale: "fr_BE",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Les enfants de l'aube",
  description: "École de natation pour enfants dès 4 ans à Namur.",
  telephone: [PHONE_TEL],
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Saint-Joseph 1",
    postalCode: "5000",
    addressLocality: "Namur",
    addressCountry: "BE",
  },
  location: {
    "@type": "Place",
    name: "Piscine Louis Namêche",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route de Gembloux 256",
      postalCode: "5002",
      addressLocality: "Saint-Servais (Namur)",
      addressCountry: "BE",
    },
  },
  sport: "Swimming",
  areaServed: "Namur",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <LandingPage />
    </>
  );
}
