# Guide d'accueil — nouveau développeur (humain + Claude)

Bienvenue sur le projet **Les Enfants de l'Aube** : plateforme de gestion des
inscriptions pour une ASBL (cours de natation + stages vacances enfants).
Ce guide permet de reprendre le travail depuis un nouvel ordinateur.

## Prérequis à installer

- **Node.js 20+** — https://nodejs.org (version LTS)
- **Git** — https://git-scm.com/download/win
- **Claude Code** — https://claude.com/claude-code (abonnement Claude personnel)

## Mise en route (5 minutes)

```bash
git clone https://github.com/abdellahmeroual-boop/lesEnfantDeLaube.git
cd lesEnfantDeLaube
npm install
```

Puis : placer le fichier de clés reçu en privé à la racine du projet et le
renommer en `.env.local` (il est ignoré par git — il ne doit JAMAIS être
commité).

```bash
npm run dev   # → http://localhost:3000
```

## Contexte pour Claude

- **Cahier des charges** : plateforme avec espace public (catalogue cours/stages,
  formulaire d'inscription, paiement Stripe), espace admin (gestion cours,
  inscriptions, moniteurs, exports CSV, statistiques) et espace moniteur (bonus).
  Langue : français uniquement. Deadline : septembre 2026.
- **Stack** : Next.js 14 App Router + TypeScript, Tailwind (couleur charte
  `#C0521A` = palette `aube`), Supabase (PostgreSQL + Auth + RLS, région EU),
  Stripe, Resend, Vercel.
- **Base de données** : schéma dans `supabase/schema.sql` (source de vérité).
  Toute évolution du schéma = nouveau fichier SQL dans `supabase/` appliqué via
  le pooler Postgres (identifiants dans `.env.local`).
- **Sécurité** : les écritures publiques (inscriptions) passent par le serveur
  avec la clé service_role ; les accès authentifiés sont contrôlés par RLS
  (fonction `public.is_admin()`).
- **Déploiement** : chaque `git push` sur `main` déploie automatiquement en
  production → https://enfants-de-laube.vercel.app (ne pousser que du code qui
  compile : `npm run build` avant de pousser).
- **Choix validés** : fiche médicale = champ libre optionnel ; inscription
  confirmée automatiquement après paiement Stripe réussi ; grille tarifaire =
  prix par mois d'inscription (JSONB `price_grid`) configurable par l'admin.

## Avancement

Voir le plan des sprints dans [README.md](README.md). Coordonnez-vous pour ne
pas travailler sur les mêmes fichiers en même temps, et faites `git pull` avant
de commencer chaque session.
