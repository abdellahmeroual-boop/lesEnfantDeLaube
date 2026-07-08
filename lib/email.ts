import "server-only";

// Envoi d'emails via Resend. Sans RESEND_API_KEY, l'envoi est simplement
// ignoré (aucune erreur) — le webhook Stripe ne doit jamais échouer à cause
// d'un email.
export async function sendConfirmationEmail(params: {
  to: string;
  parentName: string;
  childName: string;
  courseTitle: string;
  schedule: string;
  amount: number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from =
    process.env.EMAIL_FROM ?? "Les Enfants de l'Aube <onboarding@resend.dev>";

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: `Inscription confirmée — ${params.courseTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #C0521A;">Inscription confirmée 🎉</h2>
            <p>Bonjour ${params.parentName},</p>
            <p>Nous avons bien reçu votre paiement. L'inscription de
            <strong>${params.childName}</strong> est confirmée :</p>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 6px 0;"><strong>Activité</strong></td><td>${params.courseTitle}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Horaire</strong></td><td>${params.schedule}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Montant payé</strong></td><td>${params.amount.toFixed(2)} €</td></tr>
            </table>
            <p>Ce message fait office de reçu.</p>
            <p>À très bientôt,<br/>L'équipe des Enfants de l'Aube</p>
          </div>
        `,
      }),
    });
  } catch {
    // L'échec d'un email ne doit jamais bloquer la confirmation
  }
}
