import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CourseCard from "@/components/CourseCard";
import { createClient } from "@/lib/supabase/server";
import type { Course, CourseAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: courses }, { data: availability }] = await Promise.all([
    supabase.from("courses").select("*").order("title"),
    supabase.from("course_availability").select("*"),
  ]);

  const placesByCourse = new Map<string, number>(
    ((availability ?? []) as CourseAvailability[]).map((a) => [
      a.course_id,
      a.places_left,
    ])
  );

  const allCourses = (courses ?? []) as Course[];
  const cours = allCourses.filter((c) => c.type === "cours");
  const stages = allCourses.filter((c) => c.type === "stage");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-aube-50 to-neutral-50">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
              Cours de natation et{" "}
              <span className="text-aube-600">stages vacances</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Inscrivez votre enfant en ligne en quelques minutes : choisissez
              un cours ou un stage, remplissez le formulaire et payez en toute
              sécurité.
            </p>
          </div>
        </section>

        <section id="catalogue" className="mx-auto max-w-5xl px-4 pb-16">
          {allCourses.length === 0 ? (
            <p className="py-12 text-center text-neutral-500">
              Aucun cours ou stage n&apos;est disponible pour le moment.
              Revenez bientôt !
            </p>
          ) : (
            <>
              {cours.length > 0 && (
                <>
                  <h2 className="mb-4 mt-4 text-2xl font-bold text-neutral-900">
                    Cours à l&apos;année
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cours.map((c) => (
                      <CourseCard
                        key={c.id}
                        course={c}
                        placesLeft={placesByCourse.get(c.id) ?? c.capacity}
                      />
                    ))}
                  </div>
                </>
              )}

              {stages.length > 0 && (
                <>
                  <h2 className="mb-4 mt-10 text-2xl font-bold text-neutral-900">
                    Stages vacances
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stages.map((c) => (
                      <CourseCard
                        key={c.id}
                        course={c}
                        placesLeft={placesByCourse.get(c.id) ?? c.capacity}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
