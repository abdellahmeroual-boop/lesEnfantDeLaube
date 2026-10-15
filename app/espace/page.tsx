import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Point d'entrée après connexion : chaque membre de l'équipe est envoyé
// vers l'espace qui correspond à son rôle.
export default async function EspacePage() {
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

  if (profile?.role === "admin") redirect("/admin");
  if (profile?.role === "monitor") redirect("/moniteur");
  redirect("/");
}
