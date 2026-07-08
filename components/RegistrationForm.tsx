"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  submitRegistration,
  type RegistrationState,
} from "@/app/inscription/actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-aube-500 focus:outline-none focus:ring-1 focus:ring-aube-500";

function SubmitButton({ isWaitlist }: { isWaitlist: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-lg bg-aube-600 px-4 py-3 text-sm font-semibold text-white hover:bg-aube-700 disabled:opacity-60"
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
      className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="course_id" value={courseId} />

      <h2 className="font-semibold text-neutral-900">L&apos;enfant</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-neutral-700">
          Prénom *
          <input name="child_first_name" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Nom *
          <input name="child_last_name" required className={inputClass} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium text-neutral-700">
        Date de naissance *
        <input
          type="date"
          name="child_birthdate"
          required
          className={inputClass}
        />
      </label>

      <h2 className="mt-8 font-semibold text-neutral-900">
        Le parent / tuteur
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-neutral-700">
          Prénom *
          <input name="parent_first_name" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Nom *
          <input name="parent_last_name" required className={inputClass} />
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-neutral-700">
          Email *
          <input
            type="email"
            name="parent_email"
            required
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Téléphone *
          <input
            type="tel"
            name="parent_phone"
            required
            className={inputClass}
          />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium text-neutral-700">
        Adresse postale *
        <input name="address" required className={inputClass} />
      </label>

      <h2 className="mt-8 font-semibold text-neutral-900">Fiche médicale</h2>
      <label className="mt-3 block text-sm font-medium text-neutral-700">
        Allergies, contre-indications, remarques (facultatif)
        <textarea
          name="medical_notes"
          rows={3}
          className={inputClass}
          placeholder="Ex. : allergie aux arachides, asthme, peur de l'eau…"
        />
      </label>

      <label className="mt-6 flex items-start gap-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="gdpr_consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-aube-600 focus:ring-aube-500"
        />
        <span>
          J&apos;accepte que les données de ce formulaire soient utilisées par
          Les Enfants de l&apos;Aube ASBL pour la gestion de l&apos;inscription
          de mon enfant. Elles ne seront jamais transmises à des tiers et je
          peux demander leur suppression à tout moment. *
        </span>
      </label>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton isWaitlist={isWaitlist} />

      {!isWaitlist && (
        <p className="mt-3 text-center text-xs text-neutral-500">
          Paiement sécurisé par Stripe — aucune donnée bancaire ne transite par
          notre site.
        </p>
      )}
    </form>
  );
}
