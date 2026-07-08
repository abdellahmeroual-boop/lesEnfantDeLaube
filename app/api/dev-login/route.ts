import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Connexion directe pour les tests en local UNIQUEMENT.
// Désactivée en production (404).
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email") ?? "";
  const password = url.searchParams.get("password") ?? "";

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin", url.origin));
}
