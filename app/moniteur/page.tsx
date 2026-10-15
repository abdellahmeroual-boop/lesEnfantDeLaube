import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CourseGroup from "@/components/CourseGroup";
import { GROUP_CHILD_FIELDS, type Course, type GroupChild } from "@/lib/types";

export const dynamic = "force-dynamic";

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
  let children: GroupChild[] = [];
  if (courses.length > 0) {
    const { data } = await createAdminClient()
      .from("registrations")
      .select(GROUP_CHILD_FIELDS)
      .in(
        "course_id",
        courses.map((c) => c.id)
      )
      .eq("status", "confirmed")
      .order("child_last_name");
    children = (data ?? []) as GroupChild[];
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
          {courses.map((course) => (
            <CourseGroup
              key={course.id}
              course={course}
              group={children.filter((c) => c.course_id === course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
