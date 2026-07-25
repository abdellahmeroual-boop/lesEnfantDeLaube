"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { priceForDate, ageAtDate } from "@/lib/pricing";
import type { Course } from "@/lib/types";

export type RegistrationState = { error: string } | null;

function required(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function siteUrl(): string {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function submitRegistration(
  _prev: RegistrationState,
  formData: FormData
): Promise<RegistrationState> {
  const courseId = required(formData, "course_id");
  const childFirstName = required(formData, "child_first_name");
  const childLastName = required(formData, "child_last_name");
  const childBirthdate = required(formData, "child_birthdate");
  const parentFirstName = required(formData, "parent_first_name");
  const parentLastName = required(formData, "parent_last_name");
  const parentEmail = required(formData, "parent_email");
  const parentPhone = required(formData, "parent_phone");
  const address = required(formData, "address");
  const medicalNotes = required(formData, "medical_notes");
  const gdprConsent = formData.get("gdpr_consent") === "on";

  if (
    !courseId ||
    !childFirstName ||
    !childLastName ||
    !childBirthdate ||
    !parentFirstName ||
    !parentLastName ||
    !parentEmail ||
    !parentPhone ||
    !address
  ) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    return { error: "L'adresse email ne semble pas valide." };
  }
  if (!gdprConsent) {
    return {
      error:
        "Vous devez accepter le traitement des données pour finaliser l'inscription.",
    };
  }
  const birth = new Date(childBirthdate);
  if (isNaN(birth.getTime()) || birth > new Date()) {
    return { error: "La date de naissance ne semble pas valide." };
  }

  const supabase = createAdminClient();

  const { data: courseData } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!courseData) {
    return { error: "Ce cours n'existe plus." };
  }
  const course = courseData as Course;

  if (!course.is_open) {
    return { error: "Les inscriptions pour ce cours sont fermées." };
  }

  const age = ageAtDate(childBirthdate);
  if (age < course.age_min || age > course.age_max) {
    return {
      error: `Ce ${course.type} est prévu pour les enfants de ${course.age_min} à ${course.age_max} ans (votre enfant a ${age} an${age > 1 ? "s" : ""}). Contactez-nous si vous pensez qu'une exception est possible.`,
    };
  }

  // Places restantes (revérifié côté serveur au moment de l'envoi)
  const { data: avail } = await supabase
    .from("course_availability")
    .select("places_left")
    .eq("course_id", courseId)
    .single();
  const placesLeft = avail?.places_left ?? course.capacity;
  const waitlisted = placesLeft <= 0;

  const price = priceForDate(course.price_grid);

  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .insert({
      course_id: courseId,
      child_first_name: childFirstName,
      child_last_name: childLastName,
      child_birthdate: childBirthdate,
      parent_first_name: parentFirstName,
      parent_last_name: parentLastName,
      parent_email: parentEmail,
      parent_phone: parentPhone,
      address,
      medical_notes: medicalNotes,
      amount_due: waitlisted ? null : price,
      gdpr_consent: true,
      status: waitlisted ? "waitlisted" : "pending",
    })
    .select("id")
    .single();

  if (regError || !registration) {
    return {
      error:
        "Une erreur est survenue lors de l'enregistrement. Merci de réessayer.",
    };
  }

  // Liste d'attente : pas de paiement
  if (waitlisted) {
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("course_id", courseId);
    await supabase.from("waitlist").insert({
      course_id: courseId,
      registration_id: registration.id,
      position: (count ?? 0) + 1,
    });
    redirect("/inscription/merci?statut=attente");
  }

  // Paiement Stripe
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && price !== null) {
    const stripe = new Stripe(stripeKey);
    const base = siteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parentEmail,
      locale: "fr",
      // Reçu envoyé par Stripe au parent après paiement (uniquement en mode
      // live — Stripe n'envoie jamais de reçus en mode test).
      payment_intent_data: { receipt_email: parentEmail },
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `${course.title} — ${childFirstName} ${childLastName}`,
              description: course.schedule,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { registration_id: registration.id },
      success_url: `${base}/inscription/merci?statut=paye`,
      cancel_url: `${base}/inscription/${courseId}?annule=1`,
    });

    await supabase.from("payments").insert({
      registration_id: registration.id,
      stripe_session_id: session.id,
      amount: price,
      status: "pending",
    });

    redirect(session.url!);
  }

  // Stripe pas encore configuré : inscription enregistrée, paiement différé
  redirect("/inscription/merci?statut=enregistre");
}
