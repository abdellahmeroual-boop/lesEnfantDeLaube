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
- [ ] **Sprint 2** — Catalogue public, formulaire d'inscription, paiement Stripe
- [ ] **Sprint 3** — Espace admin : inscriptions, cours, moniteurs, exports CSV
- [ ] **Sprint 4** — Tests, corrections, mise en ligne, nom de domaine
