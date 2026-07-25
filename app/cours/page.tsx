import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CourseCard from "@/components/CourseCard";
import { createClient } from "@/lib/supabase/server";
import type { Course, CourseAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inscriptions — Cours et stages | Les Enfants de l'Aube",
  description:
    "Choisissez un cours de natation ou un stage vacances et inscrivez votre enfant en ligne en quelques minutes.",
};

export default async function CataloguePage() {
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
    <div className="flex min-h-screen flex-col bg-background font-nunito">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-ocean-soft via-white to-sun-soft">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/60 transition-colors hover:text-sun"
            >
              <ArrowLeft className="h-4 w-4" />
              {"Retour à l'accueil"}
            </Link>
            <h1 className="mt-4 font-display text-4xl font-bold text-ocean sm:text-5xl">
              Cours de natation et{" "}
              <span className="text-sun">stages vacances</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
              Inscrivez votre enfant en ligne en quelques minutes : choisissez
              un cours ou un stage, remplissez le formulaire et payez en toute
              sécurité.
            </p>
          </div>
        </section>

        <section id="catalogue" className="mx-auto max-w-5xl px-4 py-16 md:px-6">
          {allCourses.length === 0 ? (
            <div className="rounded-3xl bg-ocean-soft p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-sun" />
              <p className="mt-4 text-foreground/70">
                Aucun cours ou stage n&apos;est disponible pour le moment.
                Revenez bientôt !
              </p>
            </div>
          ) : (
            <>
              {cours.length > 0 && (
                <>
                  <h2 className="font-display text-2xl font-bold text-ocean">
                    Cours à l&apos;année
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <h2 className="mt-12 font-display text-2xl font-bold text-ocean">
                    Stages vacances
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
