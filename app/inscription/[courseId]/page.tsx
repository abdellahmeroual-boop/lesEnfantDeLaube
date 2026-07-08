import { notFound } from "next/navigation";
import Link from "next/link";
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
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="mt-4 text-neutral-600">
            Les inscriptions pour ce {course.type} sont actuellement fermées.
          </p>
          <Link href="/" className="mt-6 inline-block text-aube-600 underline">
            ← Retour au catalogue
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <Link href="/" className="text-sm text-aube-600 hover:underline">
          ← Retour au catalogue
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-neutral-900">
          Inscription — {course.title}
        </h1>

        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
          <p>🕐 {course.schedule}</p>
          <p className="mt-1">
            👶 De {course.age_min} à {course.age_max} ans
          </p>
          {price !== null && (
            <p className="mt-1">
              💶 Tarif ce mois-ci : <strong>{formatEUR(price)}</strong>
            </p>
          )}
        </div>

        {full && (
          <div className="mt-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-800">
            <strong>Ce {course.type} est complet.</strong> Vous pouvez inscrire
            votre enfant sur la <strong>liste d&apos;attente</strong> : nous
            vous contacterons dès qu&apos;une place se libère (aucun paiement ne
            vous sera demandé aujourd&apos;hui).
          </div>
        )}

        <RegistrationForm courseId={course.id} isWaitlist={full} />
      </main>

      <SiteFooter />
    </div>
  );
}
