import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CourseGroup from "@/components/CourseGroup";
import { GROUP_CHILD_FIELDS, type Course, type GroupChild } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CourseChildrenPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: course }, { data: children }, { data: others }] =
    await Promise.all([
      supabase.from("courses").select("*").eq("id", params.id).single(),
      supabase
        .from("registrations")
        .select(GROUP_CHILD_FIELDS)
        .eq("course_id", params.id)
        .eq("status", "confirmed")
        .order("child_last_name"),
      supabase
        .from("registrations")
        .select("status")
        .eq("course_id", params.id)
        .in("status", ["pending", "waitlisted"]),
    ]);

  if (!course) notFound();
  const c = course as Course;

  const { data: monitor } = c.monitor_id
    ? await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", c.monitor_id)
        .single()
    : { data: null };

  const pending = (others ?? []).filter((r) => r.status === "pending").length;
  const waitlisted = (others ?? []).filter(
    (r) => r.status === "waitlisted"
  ).length;

  return (
    <div>
      <Link
        href="/admin/cours"
        className="text-sm text-aube-600 hover:underline"
      >
        ← Retour aux cours
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Enfants inscrits
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Moniteur :{" "}
            {monitor ? monitor.full_name || monitor.email : "aucun attribué"}
          </p>
        </div>
        <Link
          href={`/admin/inscriptions?cours=${c.id}`}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-aube-400 hover:text-aube-600"
        >
          Gérer ces inscriptions
        </Link>
      </div>

      <CourseGroup course={c} group={(children ?? []) as GroupChild[]} />

      {(pending > 0 || waitlisted > 0) && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {pending > 0 && (
            <Link
              href={`/admin/inscriptions?cours=${c.id}&statut=pending`}
              className="rounded-lg bg-orange-50 px-3 py-2 text-orange-800 hover:underline"
            >
              + {pending} en attente de paiement
            </Link>
          )}
          {waitlisted > 0 && (
            <Link
              href={`/admin/inscriptions?cours=${c.id}&statut=waitlisted`}
              className="rounded-lg bg-sky-50 px-3 py-2 text-sky-800 hover:underline"
            >
              + {waitlisted} sur liste d&apos;attente
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
