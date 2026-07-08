// Insère des cours et stages de démonstration (préfixés [Démo]).
// Usage : node scripts/seed-demo.mjs
// Pour les retirer : node scripts/seed-demo.mjs --supprimer
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

if (process.argv.includes("--supprimer")) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .like("title", "[Démo]%");
  if (error) throw error;
  console.log("Cours de démonstration supprimés.");
  process.exit(0);
}

// Grille dégressive type pour un cours à l'année (rentrée en septembre)
const grilleCours = (base) => ({
  9: base,
  10: Math.round(base * 0.9),
  11: Math.round(base * 0.8),
  12: Math.round(base * 0.7),
  1: Math.round(base * 0.6),
  2: Math.round(base * 0.5),
  3: Math.round(base * 0.4),
  4: Math.round(base * 0.3),
  5: Math.round(base * 0.25),
  6: Math.round(base * 0.2),
  7: base, // inscriptions anticipées pour la rentrée suivante
  8: base,
});

const demo = [
  {
    title: "[Démo] École de nage — débutants",
    type: "cours",
    description: "Premiers contacts avec l'eau, flottaison et propulsion.",
    schedule: "Samedi 9h00 – 9h45",
    age_min: 4,
    age_max: 6,
    capacity: 12,
    price_grid: grilleCours(250),
    is_open: true,
  },
  {
    title: "[Démo] Natation intermédiaires",
    type: "cours",
    description: "Perfectionnement du crawl et découverte du dos crawlé.",
    schedule: "Mercredi 14h00 – 14h45",
    age_min: 6,
    age_max: 9,
    capacity: 12,
    price_grid: grilleCours(250),
    is_open: true,
  },
  {
    title: "[Démo] Perfectionnement 4 nages",
    type: "cours",
    description: "Technique des quatre nages et endurance.",
    schedule: "Samedi 10h00 – 11h00",
    age_min: 9,
    age_max: 12,
    capacity: 10,
    price_grid: grilleCours(280),
    is_open: true,
  },
  {
    title: "[Démo] Stage été — semaine du 3 août",
    type: "stage",
    description:
      "Une semaine de natation, jeux d'eau et mini-olympiades. Du lundi au vendredi.",
    schedule: "Lun 3 → ven 7 août, 9h00 – 12h00",
    age_min: 5,
    age_max: 10,
    capacity: 20,
    price_grid: { default: 95 },
    is_open: true,
  },
];

const { error } = await supabase.from("courses").insert(demo);
if (error) throw error;
console.log(`${demo.length} cours/stages de démonstration créés.`);
