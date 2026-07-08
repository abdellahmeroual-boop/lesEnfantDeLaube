import Link from "next/link";
import type { Course } from "@/lib/types";
import { priceForDate, formatEUR } from "@/lib/pricing";

export default function CourseCard({
  course,
  placesLeft,
}: {
  course: Course;
  placesLeft: number;
}) {
  const price = priceForDate(course.price_grid);
  const full = placesLeft <= 0;

  return (
    <div
      className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm ${
        course.is_open ? "border-neutral-200" : "border-neutral-200 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-neutral-900">{course.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            course.type === "stage"
              ? "bg-sky-100 text-sky-800"
              : "bg-aube-100 text-aube-800"
          }`}
        >
          {course.type === "stage" ? "Stage" : "Cours"}
        </span>
      </div>

      {course.description && (
        <p className="mt-2 text-sm text-neutral-600">{course.description}</p>
      )}

      <dl className="mt-4 space-y-1.5 text-sm text-neutral-700">
        <div className="flex gap-2">
          <dt>🕐</dt>
          <dd>{course.schedule}</dd>
        </div>
        <div className="flex gap-2">
          <dt>👶</dt>
          <dd>
            De {course.age_min} à {course.age_max} ans
          </dd>
        </div>
        <div className="flex gap-2">
          <dt>💶</dt>
          <dd>
            {price !== null ? (
              <>
                <strong>{formatEUR(price)}</strong>{" "}
                <span className="text-neutral-500">
                  (tarif si inscription ce mois-ci)
                </span>
              </>
            ) : (
              "Tarif : nous contacter"
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex-1" />

      <div className="mt-2 flex items-center justify-between gap-3">
        {course.is_open ? (
          full ? (
            <span className="text-sm font-semibold text-red-600">Complet</span>
          ) : (
            <span
              className={`text-sm font-semibold ${
                placesLeft <= 3 ? "text-orange-600" : "text-green-700"
              }`}
            >
              {placesLeft} place{placesLeft > 1 ? "s" : ""} restante
              {placesLeft > 1 ? "s" : ""}
            </span>
          )
        ) : (
          <span className="text-sm font-semibold text-neutral-500">
            Inscriptions fermées
          </span>
        )}

        {course.is_open && (
          <Link
            href={`/inscription/${course.id}`}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              full
                ? "bg-neutral-500 hover:bg-neutral-600"
                : "bg-aube-600 hover:bg-aube-700"
            }`}
          >
            {full ? "Liste d'attente" : "Inscrire mon enfant"}
          </Link>
        )}
      </div>
    </div>
  );
}
