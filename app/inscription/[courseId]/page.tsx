import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Baby, Wallet } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RegistrationForm from "@/components/RegistrationForm";
import { createClient } from "@/lib/supabase/server";
import { priceForDate, formatEUR } from "@/lib/pricing";
import type { Course, CourseAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function InscriptionPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createClient();

  const [{ data: courseData }, { data: availData }] = await Promise.all([
    supabase.from("courses").select("*").eq("id", params.courseId).single(),
    supabase
      .from("course_availability")
      .select("*")
      .eq("course_id", params.courseId)
      .single(),
  ]);

  if (!courseData) notFound();
  const course = courseData as Course;
  const availability = availData as CourseAvailability | null;
  const placesLeft = availability?.places_left ?? course.capacity;
  const price = priceForDate(course.price_grid);
  const full = placesLeft <= 0;

  if (!course.is_open) {
    return (
      <div className="flex min-h-screen flex-col bg-background font-nunito">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-ocean">
            {course.title}
          </h1>
          <p className="mt-4 text-foreground/70">
            Les inscriptions pour ce {course.type} sont actuellement fermées.
          </p>
          <Link
            href="/cours"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-nunito">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <Link
          href="/cours"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/60 transition-colors hover:text-sun"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold text-ocean">
          Inscription — <span className="text-sun">{course.title}</span>
        </h1>

        <dl className="mt-6 space-y-2.5 rounded-3xl border border-border bg-ocean-soft p-6 text-sm text-foreground/80">
          <div className="flex items-center gap-3">
            <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white">
              <Clock className="h-4 w-4 text-ocean" />
              <span className="sr-only">Horaire</span>
            </dt>
            <dd>{course.schedule}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white">
              <Baby className="h-4 w-4 text-ocean" />
              <span className="sr-only">Âge</span>
            </dt>
            <dd>
              De {course.age_min} à {course.age_max} ans
            </dd>
          </div>
          {price !== null && (
            <div className="flex items-center gap-3">
              <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white">
                <Wallet className="h-4 w-4 text-sun" />
                <span className="sr-only">Tarif</span>
              </dt>
              <dd>
                Tarif ce mois-ci :{" "}
                <strong className="font-display text-base text-ocean">
                  {formatEUR(price)}
                </strong>
              </dd>
            </div>
          )}
        </dl>

        {full && (
          <div className="mt-5 rounded-3xl bg-sun-soft p-6 text-sm text-foreground/80">
            <strong className="text-ocean">
              Ce {course.type} est complet.
            </strong>{" "}
            Vous pouvez inscrire votre enfant sur la{" "}
            <strong>liste d&apos;attente</strong> : nous vous contacterons dès
            qu&apos;une place se libère (aucun paiement ne vous sera demandé
            aujourd&apos;hui).
          </div>
        )}

        <RegistrationForm courseId={course.id} isWaitlist={full} />
      </main>

      <SiteFooter />
    </div>
  );
}
