"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createMonitor, type ActionState } from "@/app/admin/actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-aube-500 focus:outline-none focus:ring-1 focus:ring-aube-500";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded-lg bg-aube-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-aube-700 disabled:opacity-60"
    >
      {pending ? "Création…" : "Créer le compte moniteur"}
    </button>
  );
}

export default function MonitorForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(
    createMonitor,
    null
  );

  return (
    <form
      action={formAction}
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <h2 className="font-semibold text-neutral-900">Nouveau moniteur</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-neutral-700">
          Nom complet *
          <input name="full_name" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Email *
          <input type="email" name="email" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Mot de passe * (min. 8 caractères)
          <input
            type="text"
            name="password"
            required
            minLength={8}
            className={inputClass}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        Communiquez l&apos;email et le mot de passe au moniteur — il pourra se
        connecter via « Espace équipe ».
      </p>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.success}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
