# Les Enfants de l'Aube — Plateforme de gestion

Plateforme de gestion des inscriptions, paiements et moniteurs pour l'ASBL
Les Enfants de l'Aube (cours de natation et stages vacances pour enfants).

🌐 **Site en ligne** : https://enfants-de-laube.vercel.app
📦 **Dépôt GitHub** : https://github.com/abdellahmeroual-boop/lesEnfantDeLaube
(chaque `git push` sur `main` met automatiquement le site à jour)

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — couleur principale `#C0521A` (palette `aube`)
- **Supabase** — PostgreSQL + Auth + Row Level Security (région EU)
- **Stripe** — paiements en ligne (Sprint 2)
- **Resend** — emails de confirmation (Sprint 2)
- **Vercel** — hébergement (Sprint 4)

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

Les clés d'environnement sont dans `.env.local` (jamais publié — voir
`.env.example` pour la liste des variables).

## Pages publiques

- `/` — page vitrine (présentation, approche, tarifs, avis, FAQ, contact).
  Boutons « S'inscrire en ligne » → `/cours`.
- `/cours` — catalogue des cours et stages, point d'entrée des inscriptions.

Les images de la vitrine se déposent dans `public/images/landing/` en gardant
les noms listés dans [`lib/landing-images.ts`](lib/landing-images.ts)
(`logo.png`, `mascotte.png`, `hero-pool.jpg`, `coach.jpg`, `joy.jpg`).
Tant qu'un fichier manque, un dégradé de remplacement s'affiche à sa place.

## Base de données

Le schéma complet est dans [`supabase/schema.sql`](supabase/schema.sql) :
tables `profiles`, `courses`, `registrations`, `payments`, `waitlist`,
politiques RLS et vue publique `course_availability` (places restantes).

À exécuter dans le SQL Editor de Supabase (script idempotent).

### Créer un compte admin

```bash
npm run create-admin -- email@exemple.be MotDePasseSolide
```

## Avancement (plan 4 sprints)

- [x] **Sprint 1** — Projet Next.js, Supabase configuré, auth admin, schéma DB
- [x] **Sprint 2** — Catalogue public, formulaire d'inscription, paiement Stripe
      (emails Resend : finalisation prévue au Sprint 4 avec le nom de domaine)
- [x] **Sprint 3** — Espace admin : inscriptions, cours, moniteurs, exports CSV
- [ ] **Sprint 4** — Tests, corrections, mise en ligne, nom de domaine
