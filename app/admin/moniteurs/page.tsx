import { createClient } from "@/lib/supabase/server";
import MonitorForm from "@/components/admin/MonitorForm";
import type { Course, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMonitorsPage() {
  const supabase = createClient();

  const [{ data: monitors }, { data: courses }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "monitor")
      .order("full_name"),
    supabase.from("courses").select("id, title, monitor_id"),
  ]);

  const coursesByMonitor = new Map<string, string[]>();
  for (const c of (courses ?? []) as Pick<
    Course,
    "id" | "title" | "monitor_id"
  >[]) {
    if (c.monitor_id) {
      const list = coursesByMonitor.get(c.monitor_id) ?? [];
      list.push(c.title);
      coursesByMonitor.set(c.monitor_id, list);
    }
  }

  const monitorList = (monitors ?? []) as Profile[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Moniteurs</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Créez les comptes de votre équipe, puis attribuez-leur des cours depuis
        la fiche de chaque cours.
      </p>

      <div className="mt-6">
        <MonitorForm />
      </div>

      {monitorList.length === 0 ? (
        <p className="mt-8 text-neutral-500">
          Aucun moniteur pour le moment.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Cours attribués</th>
                <th className="px-4 py-3">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {monitorList.map((m) => (
                <tr key={m.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {m.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{m.email}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {coursesByMonitor.get(m.id)?.join(", ") ?? (
                      <span className="text-neutral-400">Aucun</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {new Date(m.created_at).toLocaleDateString("fr-BE")}
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
