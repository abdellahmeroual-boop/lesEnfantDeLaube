import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-aube-600">
          Les Enfants de l&apos;Aube
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#catalogue" className="text-neutral-600 hover:text-aube-600">
            Cours &amp; stages
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-neutral-600 hover:border-aube-400 hover:text-aube-600"
          >
            Espace équipe
          </Link>
        </nav>
      </div>
    </header>
  );
}
