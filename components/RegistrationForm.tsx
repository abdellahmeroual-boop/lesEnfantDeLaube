"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  submitRegistration,
  type RegistrationState,
} from "@/app/inscription/actions";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition focus:border-sun focus:outline-none focus:ring-2 focus:ring-sun";

const labelClass = "block text-sm font-semibold text-foreground/80";

function SubmitButton({ isWaitlist }: { isWaitlist: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 w-full rounded-full bg-sun px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 disabled:translate-y-0 disabled:opacity-60"
    >
      {pending
        ? "Envoi en cours…"
        : isWaitlist
          ? "Rejoindre la liste d'attente"
          : "Valider et passer au paiement"}
    </button>
  );
}

export default function RegistrationForm({
  courseId,
  isWaitlist,
}: {
  courseId: string;
  isWaitlist: boolean;
}) {
  const [state, formAction] = useFormState<RegistrationState, FormData>(
    submitRegistration,
    null
  );

  return (
    <form
      action={formAction}
      className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8"
    >
      <input type="hidden" name="course_id" value={courseId} />

      <h2 className="font-display text-lg font-bold text-ocean">
        L&apos;enfant
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Prénom *
          <input name="child_first_name" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Nom *
          <input name="child_last_name" required className={inputClass} />
        </label>
      </div>
      <label className={`mt-4 ${labelClass}`}>
        Date de naissance *
        <input
          type="date"
          name="child_birthdate"
          required
          className={inputClass}
        />
      </label>

      <h2 className="mt-8 font-display text-lg font-bold text-ocean">
        Le parent / tuteur
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Prénom *
          <input name="parent_first_name" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Nom *
          <input name="parent_last_name" required className={inputClass} />
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Email *
          <input
            type="email"
            name="parent_email"
            required
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Téléphone *
          <input
            type="tel"
            name="parent_phone"
            required
            className={inputClass}
          />
        </label>
      </div>
      <label className={`mt-4 ${labelClass}`}>
        Adresse postale *
        <input name="address" required className={inputClass} />
      </label>

      <h2 className="mt-8 font-display text-lg font-bold text-ocean">
        Fiche médicale
      </h2>
      <label className={`mt-3 ${labelClass}`}>
        Allergies, contre-indications, remarques (facultatif)
        <textarea
          name="medical_notes"
          rows={3}
          className={inputClass}
          placeholder="Ex. : allergie aux arachides, asthme, peur de l'eau…"
        />
      </label>

      <label className="mt-8 flex items-start gap-3 rounded-2xl bg-ocean-soft p-4 text-sm text-foreground/80">
        <input
          type="checkbox"
          name="gdpr_consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-sun focus:ring-sun"
        />
        <span>
          J&apos;accepte que les données de ce formulaire soient utilisées par
          Les Enfants de l&apos;Aube ASBL pour la gestion de l&apos;inscription
          de mon enfant. Elles ne seront jamais transmises à des tiers et je
          peux demander leur suppression à tout moment. *
        </span>
      </label>

      {state?.error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton isWaitlist={isWaitlist} />

      {!isWaitlist && (
        <p className="mt-4 text-center text-xs text-foreground/50">
          Paiement sécurisé par Stripe — aucune donnée bancaire ne transite par
          notre site.
        </p>
      )}
    </form>
  );
}
