import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STATUS_FR: Record<string, string> = {
  pending: "En attente",
  paid: "Payé",
  late: "En retard",
  failed: "Échoué",
  refunded: "Remboursé",
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
    .from("payments")
    .select(
      "*, registrations(child_first_name, child_last_name, parent_first_name, parent_last_name, parent_email, courses(title))"
    )
    .order("created_at", { ascending: false });

  const header = [
    "Date",
    "Cours / stage",
    "Enfant",
    "Parent",
    "Email",
    "Montant (€)",
    "Statut",
    "Payé le",
    "Référence Stripe",
  ];

  const rows = (data ?? []).map((p: any) =>
    [
      new Date(p.created_at).toLocaleDateString("fr-BE"),
      p.registrations?.courses?.title ?? "",
      p.registrations
        ? `${p.registrations.child_first_name} ${p.registrations.child_last_name}`
        : "",
      p.registrations
        ? `${p.registrations.parent_first_name} ${p.registrations.parent_last_name}`
        : "",
      p.registrations?.parent_email ?? "",
      String(p.amount).replace(".", ","),
      STATUS_FR[p.status] ?? p.status,
      p.paid_at ? new Date(p.paid_at).toLocaleString("fr-BE") : "",
      p.stripe_payment_id ?? "",
    ]
      .map(csvCell)
      .join(";")
  );

  const csv = "﻿" + [header.map(csvCell).join(";"), ...rows].join("\r\n");
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="paiements-${today}.csv"`,
    },
  });
}
