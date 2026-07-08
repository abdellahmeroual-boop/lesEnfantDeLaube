import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Registration } from "@/lib/types";

const STATUS_FR: Record<string, string> = {
  pending: "En attente de paiement",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  waitlisted: "Liste d'attente",
};

function csvCell(value: unknown): string {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Non autorisé", { status: 401 });
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return new NextResponse("Non autorisé", { status: 403 });
  }

  const { data } = await supabase
    .from("registrations")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  const header = [
    "Date d'inscription",
    "Cours / stage",
    "Prénom enfant",
    "Nom enfant",
    "Date de naissance",
    "Prénom parent",
    "Nom parent",
    "Email",
    "Téléphone",
    "Adresse",
    "Fiche médicale",
    "Montant (€)",
    "Statut",
  ];

  const rows = ((data ?? []) as Registration[]).map((r) =>
    [
      new Date(r.created_at).toLocaleDateString("fr-BE"),
      r.courses?.title ?? "",
      r.child_first_name,
      r.child_last_name,
      new Date(r.child_birthdate).toLocaleDateString("fr-BE"),
      r.parent_first_name,
      r.parent_last_name,
      r.parent_email,
      r.parent_phone,
      r.address,
      r.medical_notes,
      r.amount_due != null ? String(r.amount_due).replace(".", ",") : "",
      STATUS_FR[r.status] ?? r.status,
    ]
      .map(csvCell)
      .join(";")
  );

  // BOM UTF-8 + séparateur ; pour une ouverture propre dans Excel français
  const csv = "﻿" + [header.map(csvCell).join(";"), ...rows].join("\r\n");
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscriptions-${today}.csv"`,
    },
  });
}
