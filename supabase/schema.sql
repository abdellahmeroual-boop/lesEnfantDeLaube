-- ============================================================
-- Les Enfants de l'Aube — Schéma de base de données (Outil 1)
-- À exécuter dans le SQL Editor de Supabase (une seule fois).
-- Script idempotent : peut être relancé sans danger.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- PROFILS (liés à Supabase Auth)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text default '',
  role text not null default 'monitor' check (role in ('admin', 'monitor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- L'utilisateur courant est-il admin ?
-- (security definer : évite la récursion dans les politiques RLS)
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Création automatique du profil quand un utilisateur est créé
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'monitor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- COURS ET STAGES
-- ------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('cours', 'stage')),
  description text default '',
  schedule text not null default '',
  age_min integer not null check (age_min >= 0),
  age_max integer not null check (age_max >= age_min),
  capacity integer not null check (capacity > 0),
  -- Grille tarifaire dégressive :
  -- { "9": 250, "10": 230, "11": 210 } → clé = mois d'inscription (1 à 12),
  -- valeur = prix en euros pour une inscription faite ce mois-là.
  price_grid jsonb not null default '{}'::jsonb,
  is_open boolean not null default true,
  monitor_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

-- ------------------------------------------------------------
-- INSCRIPTIONS
-- ------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  child_first_name text not null,
  child_last_name text not null,
  child_birthdate date not null,
  parent_first_name text not null,
  parent_last_name text not null,
  parent_email text not null,
  parent_phone text not null,
  address text not null,
  medical_notes text default '',
  amount_due numeric(8, 2),
  gdpr_consent boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'waitlisted')),
  created_at timestamptz not null default now()
);

create index if not exists registrations_course_id_idx
  on public.registrations (course_id);
create index if not exists registrations_status_idx
  on public.registrations (status);

alter table public.registrations enable row level security;

-- ------------------------------------------------------------
-- PAIEMENTS
-- ------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations (id) on delete cascade,
  stripe_session_id text,
  stripe_payment_id text,
  amount numeric(8, 2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'late', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payments_registration_id_idx
  on public.payments (registration_id);

alter table public.payments enable row level security;

-- ------------------------------------------------------------
-- LISTE D'ATTENTE
-- ------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  registration_id uuid not null references public.registrations (id) on delete cascade,
  position integer not null,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_course_position_idx
  on public.waitlist (course_id, position);

alter table public.waitlist enable row level security;

-- ============================================================
-- POLITIQUES DE SÉCURITÉ (Row Level Security)
-- Les inscriptions publiques passent par le serveur Next.js
-- (clé service_role, qui contourne RLS). Les règles ci-dessous
-- couvrent les accès authentifiés et la lecture publique.
-- ============================================================

-- Profils : chacun peut lire son propre profil, l'admin gère tout
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Cours : lecture publique (catalogue), écriture réservée à l'admin
drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read" on public.courses
  for select using (true);

drop policy if exists "courses_admin_insert" on public.courses;
create policy "courses_admin_insert" on public.courses
  for insert with check (public.is_admin());

drop policy if exists "courses_admin_update" on public.courses;
create policy "courses_admin_update" on public.courses
  for update using (public.is_admin());

drop policy if exists "courses_admin_delete" on public.courses;
create policy "courses_admin_delete" on public.courses
  for delete using (public.is_admin());

-- Inscriptions : admin uniquement (l'espace moniteur viendra plus tard)
drop policy if exists "registrations_admin_all" on public.registrations;
create policy "registrations_admin_all" on public.registrations
  for all using (public.is_admin()) with check (public.is_admin());

-- Paiements : admin uniquement
drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- Liste d'attente : admin uniquement
drop policy if exists "waitlist_admin_all" on public.waitlist;
create policy "waitlist_admin_all" on public.waitlist
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- VUE PUBLIQUE : PLACES RESTANTES EN TEMPS RÉEL
-- N'expose que des compteurs, aucune donnée personnelle.
-- ------------------------------------------------------------
create or replace view public.course_availability as
select
  c.id as course_id,
  c.capacity,
  count(r.id) filter (where r.status = 'confirmed') as confirmed_count,
  greatest(
    c.capacity - count(r.id) filter (where r.status = 'confirmed'),
    0
  ) as places_left
from public.courses c
left join public.registrations r on r.course_id = c.id
group by c.id;

grant select on public.course_availability to anon, authenticated;
