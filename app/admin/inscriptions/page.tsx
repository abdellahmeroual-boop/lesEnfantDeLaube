import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { setRegistrationStatus } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { formatEUR, ageAtDate } from "@/lib/pricing";
import type { Course, Registration, RegistrationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  pending: "En attente de paiement",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  waitlisted: "Liste d'attente",
};

const STATUS_STYLES: Record<RegistrationStatus, string> = {
  pending: "bg-orange-100 text-orange-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-500",
  waitlisted: "bg-sky-100 text-sky-800",
};

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: { cours?: string; statut?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("registrations")
    .select("*, courses(title, type)")
    .order("created_at", { ascending: false });

  if (searchParams.cours) query = query.eq("course_id", searchParams.cours);
  if (searchParams.statut) query = query.eq("status", searchParams.statut);

  const [{ data: registrations }, { data: courses }] = await Promise.all([
    query,
    supabase.from("courses").select("id, title").order("title"),
  ]);

  const regs = (registrations ?? []) as Registration[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">Inscriptions</h1>
        <a
          href="/admin/inscriptions/export"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-aube-400 hover:text-aube-600"
        >
          ⬇ Exporter en CSV (Excel)
        </a>
      </div>

      {/* Filtres */}
      <form
        method="get"
        className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4"
      >
        <label className="block text-sm font-medium text-neutral-700">
          Cours / stage
          <select
            name="cours"
            defaultValue={searchParams.cours ?? ""}
            className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {((courses ?? []) as Pick<Course, "id" | "title">[]).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Statut
          <select
            name="statut"
            defaultValue={searchParams.statut ?? ""}
            className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Filtrer
        </button>
        {(searchParams.cours || searchParams.statut) && (
          <Link
            href="/admin/inscriptions"
            className="text-sm text-aube-600 hover:underline"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {regs.length === 0 ? (
        <p className="mt-8 text-neutral-500">
          Aucune inscription ne correspond à ces critères.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                <th className="px-4 py-3">Enfant</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Cours</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">
                      {r.child_first_name} {r.child_last_name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {ageAtDate(r.child_birthdate)} ans
                      {r.medical_notes && (
                        <span title={r.medical_notes}> · ⚕️ fiche médicale</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {r.parent_first_name} {r.parent_last_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    <div>{r.parent_email}</div>
                    <div className="text-xs">{r.parent_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {r.courses?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {r.amount_due != null ? formatEUR(Number(r.amount_due)) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {new Date(r.created_at).toLocaleDateString("fr-BE")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                      {r.status !== "confirmed" && r.status !== "cancelled" && (
                        <ConfirmSubmit
                          action={setRegistrationStatus}
                          hidden={{ id: r.id, status: "confirmed" }}
                          message={`Confirmer l'inscription de ${r.child_first_name} ${r.child_last_name} ?${r.status === "waitlisted" ? " (elle sera retirée de la liste d'attente)" : ""}`}
                          className="font-medium text-green-700 hover:underline"
                        >
                          Confirmer
                        </ConfirmSubmit>
                      )}
                      {r.status !== "cancelled" && (
                        <ConfirmSubmit
                          action={setRegistrationStatus}
                          hidden={{ id: r.id, status: "cancelled" }}
                          message={`Annuler l'inscription de ${r.child_first_name} ${r.child_last_name} ?`}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Annuler
                        </ConfirmSubmit>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
