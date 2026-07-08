export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Les Enfants de l&apos;Aube ASBL — Tous
        droits réservés
      </div>
    </footer>
  );
}
