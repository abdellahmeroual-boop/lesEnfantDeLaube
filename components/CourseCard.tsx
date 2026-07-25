import Link from "next/link";
import { Clock, Baby, Wallet } from "lucide-react";
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
      className={`flex flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 ${
        course.is_open
          ? "hover:-translate-y-1 hover:border-ocean/20 hover:shadow-xl"
          : "opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-ocean">
          {course.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            course.type === "stage"
              ? "bg-ocean-soft text-ocean"
              : "bg-sun-soft text-sun"
          }`}
        >
          {course.type === "stage" ? "Stage" : "Cours"}
        </span>
      </div>

      {course.description && (
        <p className="mt-2 text-sm text-foreground/70">{course.description}</p>
      )}

      <dl className="mt-5 space-y-2.5 text-sm text-foreground/80">
        <div className="flex items-center gap-3">
          <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ocean-soft">
            <Clock className="h-4 w-4 text-ocean" />
            <span className="sr-only">Horaire</span>
          </dt>
          <dd>{course.schedule}</dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ocean-soft">
            <Baby className="h-4 w-4 text-ocean" />
            <span className="sr-only">Âge</span>
          </dt>
          <dd>
            De {course.age_min} à {course.age_max} ans
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sun-soft">
            <Wallet className="h-4 w-4 text-sun" />
            <span className="sr-only">Tarif</span>
          </dt>
          <dd>
            {price !== null ? (
              <>
                <strong className="font-display text-base text-ocean">
                  {formatEUR(price)}
                </strong>{" "}
                <span className="text-foreground/50">
                  (tarif si inscription ce mois-ci)
                </span>
              </>
            ) : (
              "Tarif : nous contacter"
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex-1" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {course.is_open ? (
          full ? (
            <span className="text-sm font-bold text-red-600">Complet</span>
          ) : (
            <span
              className={`text-sm font-bold ${
                placesLeft <= 3 ? "text-sun" : "text-emerald-600"
              }`}
            >
              {placesLeft} place{placesLeft > 1 ? "s" : ""} restante
              {placesLeft > 1 ? "s" : ""}
            </span>
          )
        ) : (
          <span className="text-sm font-bold text-foreground/50">
            Inscriptions fermées
          </span>
        )}

        {course.is_open && (
          <Link
            href={`/inscription/${course.id}`}
            className={`rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 ${
              full ? "bg-ocean" : "bg-sun"
            }`}
          >
            {full ? "Liste d'attente" : "Inscrire mon enfant"}
          </Link>
        )}
      </div>
    </div>
  );
}
