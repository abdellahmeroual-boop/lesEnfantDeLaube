import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe non configuré" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationId = session.metadata?.registration_id;

    if (registrationId) {
      const supabase = createAdminClient();

      await supabase
        .from("payments")
        .update({
          status: "paid",
          stripe_payment_id: String(session.payment_intent ?? ""),
          paid_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id);

      await supabase
        .from("registrations")
        .update({ status: "confirmed" })
        .eq("id", registrationId);

      const { data: reg } = await supabase
        .from("registrations")
        .select("*, courses(title, schedule)")
        .eq("id", registrationId)
        .single();

      if (reg) {
        await sendConfirmationEmail({
          to: reg.parent_email,
          parentName: `${reg.parent_first_name} ${reg.parent_last_name}`,
          childName: `${reg.child_first_name} ${reg.child_last_name}`,
          courseTitle: reg.courses?.title ?? "",
          schedule: reg.courses?.schedule ?? "",
          amount: Number(reg.amount_due ?? 0),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
