"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LandingImage from "@/components/landing/LandingImage";
import { landingImages } from "@/lib/landing-images";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition focus:border-sun focus:outline-none focus:ring-2 focus:ring-sun";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/espace");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ocean-soft via-white to-sun-soft px-4 font-nunito">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <LandingImage
              src={landingImages.logo}
              alt="Logo Les enfants de l'aube"
              className="h-12 w-auto"
              priority
            />
            <span className="font-display text-xl font-bold text-ocean">
              {"Les enfants de l'aube"}
            </span>
          </Link>
          <p className="mt-3 text-sm text-foreground/60">
            Espace réservé à l&apos;équipe
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8"
        >
          <label className="block text-sm font-semibold text-foreground/80">
            Adresse email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-foreground/80">
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </label>

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-sun px-6 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 disabled:translate-y-0 disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-foreground/60 hover:text-sun">
            {"← Retour au site"}
          </Link>
        </p>
      </div>
    </div>
  );
}
