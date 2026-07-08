import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-aube-600">
            Les Enfants de l&apos;Aube
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-neutral-600 hover:text-aube-600">
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

      <main className="flex-1">
        <section className="bg-gradient-to-b from-aube-50 to-neutral-50">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
              Cours de natation et{" "}
              <span className="text-aube-600">stages vacances</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Inscrivez votre enfant en ligne en quelques minutes : choisissez
              un cours ou un stage, remplissez le formulaire et payez en toute
              sécurité.
            </p>
            <div className="mt-8">
              <span className="inline-block rounded-full bg-aube-100 px-4 py-2 text-sm font-medium text-aube-800">
                Le catalogue des cours arrive bientôt 🏊
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Les Enfants de l&apos;Aube ASBL — Tous
          droits réservés
        </div>
      </footer>
    </div>
  );
}
