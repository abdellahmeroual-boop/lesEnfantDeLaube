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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-20 text-center">
        <div className="text-5xl">{message.emoji}</div>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">
          {message.title}
        </h1>
        <p className="mt-3 text-neutral-600">{message.body}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-aube-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-aube-700"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
