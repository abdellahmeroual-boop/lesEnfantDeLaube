import Link from "next/link";
import { PHONE, PHONE_TEL, EMAIL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg font-bold text-white">
              {"Les enfants de l'aube"}
            </p>
            <p className="mt-1 text-sm">
              ASBL — École de natation pour enfants à Namur.
            </p>
          </div>
          <ul className="space-y-2 text-sm md:text-right">
            <li>
              <a href={`tel:${PHONE_TEL}`} className="hover:text-sun">
                {PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="break-all hover:text-sun">
                {EMAIL}
              </a>
            </li>
            <li>Rue Saint-Joseph 1, 5000 Namur</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-5 text-xs md:px-6">
          <span>
            © {new Date().getFullYear()}{" "}
            {"Les enfants de l'aube ASBL — Tous droits réservés."}
          </span>
          <Link href="/" className="hover:text-sun">
            {"Retour à l'accueil"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
