import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const MESSAGES: Record<
  string,
  { emoji: string; title: string; body: string }
> = {
  paye: {
    emoji: "🎉",
    title: "Paiement reçu — inscription confirmée !",
    body: "Merci ! Vous allez recevoir un email de confirmation avec le récapitulatif et votre reçu. À très bientôt à la piscine !",
  },
  attente: {
    emoji: "⏳",
    title: "Vous êtes sur la liste d'attente",
    body: "Votre demande a bien été enregistrée. Nous vous contacterons par email ou téléphone dès qu'une place se libère. Aucun paiement ne vous a été demandé.",
  },
  enregistre: {
    emoji: "✅",
    title: "Inscription enregistrée",
    body: "Votre inscription a bien été enregistrée. Nous vous contacterons très prochainement pour le paiement.",
  },
};

export default function MerciPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  const message = MESSAGES[searchParams.statut ?? ""] ?? MESSAGES.enregistre;

  return (
    <div className="flex min-h-screen flex-col bg-background font-nunito">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-br from-ocean-soft via-white to-sun-soft">
        <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
          <div className="text-6xl">{message.emoji}</div>
          <h1 className="mt-5 font-display text-3xl font-bold text-ocean">
            {message.title}
          </h1>
          <p className="mt-4 text-lg text-foreground/70">{message.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-sun px-7 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110"
            >
              {"Retour à l'accueil"}
            </Link>
            <Link
              href="/cours"
              className="rounded-full bg-ocean px-7 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110"
            >
              Voir les autres cours
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
