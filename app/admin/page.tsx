export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Tableau de bord</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Bienvenue dans l&apos;espace de gestion des Enfants de l&apos;Aube.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Inscriptions", value: "0" },
          { label: "Cours ouverts", value: "0" },
          { label: "Paiements reçus", value: "0 €" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-aube-600">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-neutral-400">
        La gestion des cours, inscriptions et paiements sera disponible au
        Sprint 3.
      </p>
    </div>
  );
}
