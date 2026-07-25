import Link from "next/link";
import LandingImage from "@/components/landing/LandingImage";
import { landingImages } from "@/lib/landing-images";
import { PHONE, PHONE_TEL } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LandingImage
            src={landingImages.logo}
            alt="Logo Les enfants de l'aube"
            className="h-10 w-auto md:h-12"
            priority
          />
          <span className="hidden font-display text-lg font-bold leading-tight text-ocean sm:block md:text-xl">
            Les enfants
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            {"de l'aube"}
          </span>
        </Link>

        <nav className="flex items-center gap-3 md:gap-6">
          <Link
            href="/cours"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-sun"
          >
            Cours &amp; stages
          </Link>
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden items-center gap-2 font-bold text-ocean transition-colors hover:text-sun lg:inline-flex"
          >
            {PHONE}
          </a>
          <Link
            href="/login"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:border-ocean/30 hover:text-ocean"
          >
            Espace équipe
          </Link>
        </nav>
      </div>
    </header>
  );
}
