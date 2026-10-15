import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ageAtDate } from "@/lib/pricing";
import type { Course } from "@/lib/types";

export const dynamic = "force-dynamic";

type Child = {
  id: string;
  course_id: string;
  child_first_name: string;
  child_last_name: string;
  child_birthdate: string;
  medical_notes: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_phone: string;
};

export default async function MoniteurPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: coursesData } = await supabase
    .from("courses")
    .select("*")
    .eq("monitor_id", user!.id)
    .order("title");
  const courses = (coursesData ?? []) as Course[];

  // La RLS réserve les inscriptions à l'admin : on les lit avec la clé
  // serveur, strictement limitées aux cours attribués à ce moniteur, et
  // seulement les champs utiles en bord de bassin (ni email ni adresse).
  let children: Child[] = [];
  if (courses.length > 0) {
    const { data } = await createAdminClient()
      .from("registrations")
      .select(
        "id, course_id, child_first_name, child_last_name, child_birthdate, medical_notes, parent_first_name, parent_last_name, parent_phone"
      )
      .in(
        "course_id",
        courses.map((c) => c.id)
      )
      .eq("status", "confirmed")
      .order("child_last_name");
    children = (data ?? []) as Child[];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Mes groupes</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Les enfants inscrits (paiement confirmé) dans les cours qui vous sont
        attribués.
      </p>

      {courses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 text-neutral-600">
          Aucun cours ne vous est encore attribué. L&apos;administrateur peut
          vous en attribuer depuis la fiche de chaque cours.
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {courses.map((course) => {
            const group = children.filter((c) => c.course_id === course.id);
            return (
              <section
                key={course.id}
                className="rounded-xl border border-neutral-200 bg-white"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 p-5">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      {course.title}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {course.schedule} · {course.age_min}–{course.age_max} ans
                    </p>
                  </div>
                  <span className="rounded-full bg-aube-100 px-3 py-1 text-sm font-semibold text-aube-800">
                    {group.length}/{course.capacity} enfant
                    {group.length > 1 ? "s" : ""}
                  </span>
                </div>

                {group.length === 0 ? (
                  <p className="p-5 text-sm text-neutral-500">
                    Aucun enfant inscrit pour le moment.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                          <th className="px-5 py-3">Enfant</th>
                          <th className="px-5 py-3">Âge</th>
                          <th className="px-5 py-3">Fiche médicale</th>
                          <th className="px-5 py-3">Parent</th>
                          <th className="px-5 py-3">Téléphone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.map((c) => (
                          <tr
                            key={c.id}
                            className="border-b border-neutral-100 align-top last:border-0"
                          >
                            <td className="px-5 py-3 font-medium text-neutral-900">
                              {c.child_first_name} {c.child_last_name}
                            </td>
                            <td className="whitespace-nowrap px-5 py-3 text-neutral-600">
                              {ageAtDate(c.child_birthdate)} ans
                            </td>
                            <td className="px-5 py-3">
                              {c.medical_notes ? (
                                <span className="inline-block rounded-lg bg-amber-50 px-2 py-1 text-amber-900">
                                  ⚕️ {c.medical_notes}
                                </span>
                              ) : (
                                <span className="text-neutral-400">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-neutral-700">
                              {c.parent_first_name} {c.parent_last_name}
                            </td>
                            <td className="whitespace-nowrap px-5 py-3">
                              <a
                                href={`tel:${c.parent_phone.replace(/\s/g, "")}`}
                                className="font-medium text-aube-600 hover:underline"
                              >
                                {c.parent_phone}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
