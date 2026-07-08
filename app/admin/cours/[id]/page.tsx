import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CourseForm from "@/components/admin/CourseForm";
import type { Course, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: course }, { data: monitors }] = await Promise.all([
    supabase.from("courses").select("*").eq("id", params.id).single(),
    supabase.from("profiles").select("*").eq("role", "monitor").order("full_name"),
  ]);

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/cours"
        className="text-sm text-aube-600 hover:underline"
      >
        ← Retour aux cours
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-neutral-900">
        Modifier — {(course as Course).title}
      </h1>
      <CourseForm
        course={course as Course}
        monitors={(monitors ?? []) as Profile[]}
      />
    </div>
  );
}
