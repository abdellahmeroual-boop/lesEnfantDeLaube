"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveCourse, type ActionState } from "@/app/admin/actions";
import type { Course, Profile } from "@/lib/types";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-aube-500 focus:outline-none focus:ring-1 focus:ring-aube-500";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-aube-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-aube-700 disabled:opacity-60"
    >
      {pending
        ? "Enregistrement…"
        : isNew
          ? "Créer le cours / stage"
          : "Enregistrer les modifications"}
    </button>
  );
}

export default function CourseForm({
  course,
  monitors,
}: {
  course?: Course;
  monitors: Profile[];
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(
    saveCourse,
    null
  );

  return (
    <form
      action={formAction}
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      {course && <input type="hidden" name="id" value={course.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-neutral-700 sm:col-span-2">
          Titre *
          <input
            name="title"
            required
            defaultValue={course?.title ?? ""}
            placeholder="Ex. : École de nage — débutants"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-neutral-700">
          Type *
          <select
            name="type"
            defaultValue={course?.type ?? "cours"}
            className={inputClass}
          >
            <option value="cours">Cours à l&apos;année</option>
            <option value="stage">Stage vacances</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-neutral-700">
          Horaire *
          <input
            name="schedule"
            required
            defaultValue={course?.schedule ?? ""}
            placeholder="Ex. : Samedi 9h00 – 9h45"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-neutral-700 sm:col-span-2">
          Description
          <textarea
            name="description"
            rows={2}
            defaultValue={course?.description ?? ""}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-neutral-700">
          Âge minimum *
          <input
            type="number"
            name="age_min"
            required
            min={0}
            defaultValue={course?.age_min ?? ""}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-neutral-700">
          Âge maximum *
          <input
            type="number"
            name="age_max"
            required
            min={0}
            defaultValue={course?.age_max ?? ""}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-neutral-700">
          Capacité maximale *
          <input
            type="number"
            name="capacity"
            required
            min={1}
            defaultValue={course?.capacity ?? ""}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-neutral-700">
          Moniteur attribué
          <select
            name="monitor_id"
            defaultValue={course?.monitor_id ?? ""}
            className={inputClass}
          >
            <option value="">— Aucun —</option>
            {monitors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name || m.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-neutral-900">
          Grille tarifaire (€ selon le mois d&apos;inscription)
        </legend>
        <p className="mt-1 text-xs text-neutral-500">
          Laissez un mois vide s&apos;il n&apos;a pas de tarif propre : le
          tarif « par défaut » (ou à défaut le plus élevé de la grille)
          s&apos;appliquera.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {MONTHS.map((label, i) => (
            <label key={label} className="block text-xs font-medium text-neutral-600">
              {label}
              <input
                type="number"
                step="0.01"
                min={0}
                name={`pg_${i + 1}`}
                defaultValue={course?.price_grid?.[String(i + 1)] ?? ""}
                className={inputClass}
              />
            </label>
          ))}
          <label className="block text-xs font-medium text-neutral-600">
            Par défaut
            <input
              type="number"
              step="0.01"
              min={0}
              name="pg_default"
              defaultValue={course?.price_grid?.["default"] ?? ""}
              className={inputClass}
            />
          </label>
        </div>
      </fieldset>

      <label className="mt-6 flex items-center gap-3 text-sm font-medium text-neutral-700">
        <input
          type="checkbox"
          name="is_open"
          defaultChecked={course?.is_open ?? true}
          className="h-4 w-4 rounded border-neutral-300 text-aube-600 focus:ring-aube-500"
        />
        Inscriptions ouvertes
      </label>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-6">
        <SubmitButton isNew={!course} />
      </div>
    </form>
  );
}
