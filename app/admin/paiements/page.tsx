import { createClient } from "@/lib/supabase/server";
import { formatEUR } from "@/lib/pricing";
import type { PaymentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type PaymentRow = {
  id: string;
  amount: number;
  status: PaymentStatus;
  stripe_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  registrations: {
    child_first_name: string;
    child_last_name: string;
    parent_first_name: string;
    parent_last_name: string;
    parent_email: string;
    courses: { title: string } | null;
  } | null;
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "En attente",
  paid: "Payé",
  late: "En retard",
  failed: "Échoué",
  refunded: "Remboursé",
};

const STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  late: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-neutral-100 text-neutral-500",
};

export default async function AdminPaymentsPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("payments")
    .select(
      "*, registrations(child_first_name, child_last_name, parent_first_name, parent_last_name, parent_email, courses(title))"
    )
    .order("created_at", { ascending: false });

  const payments = (data ?? []) as unknown as PaymentRow[];
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">Paiements</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-600">
            Total reçu : <strong>{formatEUR(totalPaid)}</strong>
          </span>
          <a
            href="/admin/paiements/export"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-aube-400 hover:text-aube-600"
          >
            ⬇ Exporter en CSV (Excel)
          </a>
        </div>
      </div>

      {payments.length === 0 ? (
        <p className="mt-8 text-neutral-500">Aucun paiement pour le moment.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Enfant</th>
                <th className="px-4 py-3">Cours</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Payé le</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100">
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {new Date(p.created_at).toLocaleDateString("fr-BE")}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {p.registrations
                      ? `${p.registrations.parent_first_name} ${p.registrations.parent_last_name}`
                      : "—"}
                    {p.registrations && (
                      <div className="text-xs text-neutral-500">
                        {p.registrations.parent_email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {p.registrations
                      ? `${p.registrations.child_first_name} ${p.registrations.child_last_name}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {p.registrations?.courses?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">
                    {formatEUR(Number(p.amount))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[p.status]}`}
                    >
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleString("fr-BE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
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
