import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEUR, ageAtDate } from "@/lib/pricing";
import type { Course, CourseAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

const MONTH_LABELS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: totalRegistrations },
    { count: openCourses },
    { data: paidPayments },
    { data: expected },
    { data: courses },
    { data: availability },
    { data: regs },
  ] = await Promise.all([
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .neq("status", "cancelled"),
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_open", true),
    supabase.from("payments").select("amount").eq("status", "paid"),
    supabase
      .from("registrations")
      .select("amount_due")
      .in("status", ["pending", "confirmed"]),
    supabase.from("courses").select("*").order("title"),
    supabase.from("course_availability").select("*"),
    supabase
      .from("registrations")
      .select("created_at, child_birthdate, status")
      .neq("status", "cancelled"),
  ]);

  const revenusReels = (paidPayments ?? []).reduce(
    (sum, p) => sum + Number(p.amount ?? 0),
    0
  );
  const revenusPrevisionnels = (expected ?? []).reduce(
    (sum, r) => sum + Number(r.amount_due ?? 0),
    0
  );

  const availByCourse = new Map(
    ((availability ?? []) as CourseAvailability[]).map((a) => [
      a.course_id,
      a,
    ])
  );

  // Inscriptions par mois (6 derniers mois)
  const byMonth = new Map<string, number>();
  // Inscriptions par tranche d'âge
  const byAge = { "3-5 ans": 0, "6-9 ans": 0, "10-12 ans": 0, "13 ans et +": 0 };
  for (const r of regs ?? []) {
    const d = new Date(r.created_at);
    const key = `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    const age = ageAtDate(r.child_birthdate);
    if (age <= 5) byAge["3-5 ans"]++;
    else if (age <= 9) byAge["6-9 ans"]++;
    else if (age <= 12) byAge["10-12 ans"]++;
    else byAge["13 ans et +"]++;
  }

  const stats = [
    { label: "Inscriptions actives", value: String(totalRegistrations ?? 0) },
    { label: "Cours ouverts", value: String(openCourses ?? 0) },
    { label: "Revenus reçus", value: formatEUR(revenusReels) },
    { label: "Revenus prévisionnels", value: formatEUR(revenusPrevisionnels) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Tableau de bord</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-aube-600">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900">
            Taux de remplissage
          </h2>
          {(courses ?? []).length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">
              Aucun cours pour le moment.{" "}
              <Link href="/admin/cours/nouveau" className="text-aube-600 underline">
                Créer le premier
              </Link>
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {((courses ?? []) as Course[]).map((c) => {
                const a = availByCourse.get(c.id);
                const confirmed = Number(a?.confirmed_count ?? 0);
                const pct = Math.min(
                  100,
                  Math.round((confirmed / c.capacity) * 100)
                );
                return (
                  <li key={c.id} className="text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="truncate text-neutral-700">
                        {c.title}
                      </span>
                      <span className="shrink-0 text-neutral-500">
                        {confirmed}/{c.capacity} ({pct} %)
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-neutral-100">
                      <div
                        className={`h-2 rounded-full ${
                          pct >= 100
                            ? "bg-red-500"
                            : pct >= 75
                              ? "bg-orange-400"
                              : "bg-aube-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="font-semibold text-neutral-900">
              Inscriptions par période
            </h2>
            {byMonth.size === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">
                Aucune inscription pour le moment.
              </p>
            ) : (
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {Array.from(byMonth.entries()).map(([month, count]) => (
                    <tr key={month} className="border-t border-neutral-100">
                      <td className="py-1.5 text-neutral-700">{month}</td>
                      <td className="py-1.5 text-right font-semibold text-neutral-900">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="font-semibold text-neutral-900">
              Inscriptions par tranche d&apos;âge
            </h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {Object.entries(byAge).map(([bracket, count]) => (
                  <tr key={bracket} className="border-t border-neutral-100">
                    <td className="py-1.5 text-neutral-700">{bracket}</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
