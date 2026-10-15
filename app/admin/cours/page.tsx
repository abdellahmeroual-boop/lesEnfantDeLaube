import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCourse } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import type { Course, CourseAvailability, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const supabase = createClient();

  const [{ data: courses }, { data: availability }, { data: monitors }] =
    await Promise.all([
      supabase.from("courses").select("*").order("title"),
      supabase.from("course_availability").select("*"),
      supabase.from("profiles").select("*").eq("role", "monitor"),
    ]);

  const availByCourse = new Map(
    ((availability ?? []) as CourseAvailability[]).map((a) => [a.course_id, a])
  );
  const monitorById = new Map(
    ((monitors ?? []) as Profile[]).map((m) => [m.id, m.full_name || m.email])
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">
          Cours &amp; stages
        </h1>
        <Link
          href="/admin/cours/nouveau"
          className="rounded-lg bg-aube-600 px-4 py-2 text-sm font-semibold text-white hover:bg-aube-700"
        >
          + Nouveau cours / stage
        </Link>
      </div>

      {(courses ?? []).length === 0 ? (
        <p className="mt-8 text-neutral-500">
          Aucun cours pour le moment. Créez le premier !
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Horaire</th>
                <th className="px-4 py-3">Âges</th>
                <th className="px-4 py-3">Inscrits</th>
                <th className="px-4 py-3">Moniteur</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {((courses ?? []) as Course[]).map((c) => {
                const a = availByCourse.get(c.id);
                return (
                  <tr key={c.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {c.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          c.type === "stage"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-aube-100 text-aube-800"
                        }`}
                      >
                        {c.type === "stage" ? "Stage" : "Cours"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{c.schedule}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {c.age_min}–{c.age_max} ans
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/cours/${c.id}/enfants`}
                        className="font-medium text-aube-600 hover:underline"
                        title="Voir les enfants inscrits"
                      >
                        {Number(a?.confirmed_count ?? 0)}/{c.capacity}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {c.monitor_id
                        ? monitorById.get(c.monitor_id) ?? "?"
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {c.is_open ? (
                        <span className="font-semibold text-green-700">
                          Ouvert
                        </span>
                      ) : (
                        <span className="font-semibold text-neutral-400">
                          Fermé
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/cours/${c.id}/enfants`}
                          className="font-medium text-aube-600 hover:underline"
                        >
                          Enfants
                        </Link>
                        <Link
                          href={`/admin/cours/${c.id}`}
                          className="font-medium text-aube-600 hover:underline"
                        >
                          Modifier
                        </Link>
                        <ConfirmSubmit
                          action={deleteCourse}
                          hidden={{ id: c.id }}
                          message={`Supprimer « ${c.title} » ? Les inscriptions liées seront aussi supprimées. Cette action est irréversible.`}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Supprimer
                        </ConfirmSubmit>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
