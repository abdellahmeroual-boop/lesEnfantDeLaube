// Crée un compte administrateur dans Supabase.
// Usage : node scripts/create-admin.mjs <email> <mot_de_passe>
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage : node scripts/create-admin.mjs <email> <mot_de_passe>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: "Administrateur", role: "admin" },
});

if (error) {
  console.error("Erreur :", error.message);
  process.exit(1);
}

// S'assure que le rôle admin est bien appliqué même si le profil existait déjà
const { error: profileError } = await supabase.from("profiles").upsert({
  id: data.user.id,
  email,
  full_name: "Administrateur",
  role: "admin",
});

if (profileError) {
  console.error("Erreur profil :", profileError.message);
  process.exit(1);
}

console.log(`Compte admin créé : ${email}`);
