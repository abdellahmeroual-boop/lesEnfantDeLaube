import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseForm from "@/components/admin/CourseForm";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  const supabase = createClient();
  const { data: monitors } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "monitor")
    .order("full_name");

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/cours"
        className="text-sm text-aube-600 hover:underline"
      >
        ← Retour aux cours
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-neutral-900">
        Nouveau cours / stage
      </h1>
      <CourseForm monitors={(monitors ?? []) as Profile[]} />
    </div>
  );
}
