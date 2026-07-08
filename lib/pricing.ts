import type { PriceGrid } from "./types";

// Tarif selon le mois d'inscription (grille dégressive).
// Règle : mois exact → clé "default" → prix le plus élevé de la grille
// (on ne sous-facture jamais si la grille est incomplète).
export function priceForDate(
  grid: PriceGrid | null | undefined,
  date: Date = new Date()
): number | null {
  if (!grid) return null;
  const values = Object.values(grid).filter((v) => typeof v === "number");
  if (values.length === 0) return null;

  const exact = grid[String(date.getMonth() + 1)];
  if (typeof exact === "number") return exact;
  if (typeof grid["default"] === "number") return grid["default"];
  return Math.max(...values);
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function ageAtDate(birthdate: string, at: Date = new Date()): number {
  const birth = new Date(birthdate);
  let age = at.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    at.getMonth() < birth.getMonth() ||
    (at.getMonth() === birth.getMonth() && at.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}
