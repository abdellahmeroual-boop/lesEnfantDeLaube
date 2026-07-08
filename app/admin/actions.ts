"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PriceGrid } from "@/lib/types";

export type ActionState = { error?: string; success?: string } | null;

// Vérifie que l'utilisateur connecté est bien admin.
// Les mutations passent ensuite par le client à session utilisateur :
// la Row Level Security reste une seconde ligne de défense.
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  return supabase;
}

function parsePriceGrid(formData: FormData): PriceGrid {
  const grid: PriceGrid = {};
  for (let month = 1; month <= 12; month++) {
    const raw = String(formData.get(`pg_${month}`) ?? "").replace(",", ".");
    if (raw.trim() !== "" && !isNaN(Number(raw))) {
      grid[String(month)] = Number(raw);
    }
  }
  const def = String(formData.get("pg_default") ?? "").replace(",", ".");
  if (def.trim() !== "" && !isNaN(Number(def))) {
    grid["default"] = Number(def);
  }
  return grid;
}

export async function saveCourse(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "cours");
  const description = String(formData.get("description") ?? "").trim();
  const schedule = String(formData.get("schedule") ?? "").trim();
  const age_min = Number(formData.get("age_min"));
  const age_max = Number(formData.get("age_max"));
  const capacity = Number(formData.get("capacity"));
  const is_open = formData.get("is_open") === "on";
  const monitorRaw = String(formData.get("monitor_id") ?? "").trim();
  const monitor_id = monitorRaw === "" ? null : monitorRaw;
  const price_grid = parsePriceGrid(formData);

  if (!title || !schedule) {
    return { error: "Le titre et l'horaire sont obligatoires." };
  }
  if (isNaN(age_min) || isNaN(age_max) || age_max < age_min) {
    return { error: "La tranche d'âge est invalide." };
  }
  if (isNaN(capacity) || capacity < 1) {
    return { error: "La capacité doit être d'au moins 1." };
  }
  if (Object.keys(price_grid).length === 0) {
    return {
      error:
        "Renseignez au moins un tarif (un mois ou le tarif par défaut).",
    };
  }

  const values = {
    title,
    type,
    description,
    schedule,
    age_min,
    age_max,
    capacity,
    is_open,
    monitor_id,
    price_grid,
  };

  const { error } = id
    ? await supabase.from("courses").update(values).eq("id", id)
    : await supabase.from("courses").insert(values);

  if (error) {
    return { error: "Erreur lors de l'enregistrement : " + error.message };
  }

  revalidatePath("/admin/cours");
  revalidatePath("/");
  redirect("/admin/cours");
}

export async function deleteCourse(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabase.from("courses").delete().eq("id", id);
    revalidatePath("/admin/cours");
    revalidatePath("/");
  }
}

export async function setRegistrationStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["pending", "confirmed", "cancelled"].includes(status)) return;

  await supabase.from("registrations").update({ status }).eq("id", id);
  // Si on confirme quelqu'un depuis la liste d'attente, on l'en retire
  if (status === "confirmed" || status === "cancelled") {
    await supabase.from("waitlist").delete().eq("registration_id", id);
  }
  revalidatePath("/admin/inscriptions");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createMonitor(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();

  if (!email || !full_name) {
    return { error: "Le nom et l'email sont obligatoires." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  // La création de compte passe par l'API admin de Supabase (service_role)
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: "monitor" },
  });

  if (error) {
    return { error: "Erreur : " + error.message };
  }

  revalidatePath("/admin/moniteurs");
  return { success: `Compte moniteur créé pour ${full_name} (${email}).` };
}
