-- =====================================================================
-- TalentHub BD — Supabase RLS starter policies
-- =====================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- It enables Row Level Security on the public tables the frontend reads
-- from and gives the `anon` role read access so the connection test in
-- the dev panel can succeed.
--
-- ⚠️ This is a *dev starter*. Before production, tighten each policy
-- (e.g. only let authenticated users insert, scope SELECT to rows the
-- user owns, etc.).
-- =====================================================================

-- 0. Make sure the tables exist (no-op if they already do).
--    Adjust the column list to match your real schema.
-- create table if not exists public.organizations (
--   id uuid primary key default gen_random_uuid(),
--   org_name text not null,
--   created_at timestamptz not null default now()
-- );

-- 1. Enable RLS on every table you want the app to read.
alter table public.organizations  enable row level security;
alter table public.registrations  enable row level security;
alter table public.applications   enable row level security;
alter table public.events         enable row level security;
alter table public.opportunities  enable row level security;

-- 2. Drop any old versions of these dev policies (idempotent).
drop policy if exists "anon_read_organizations"  on public.organizations;
drop policy if exists "anon_read_registrations"  on public.registrations;
drop policy if exists "anon_read_applications"   on public.applications;
drop policy if exists "anon_read_events"         on public.events;
drop policy if exists "anon_read_opportunities"  on public.opportunities;

-- 3. Public read-only policies for the `anon` role.
--    This matches what the Vite app sends (anon key, no auth session).
create policy "anon_read_organizations"
  on public.organizations
  for select
  to anon
  using (true);

create policy "anon_read_registrations"
  on public.registrations
  for select
  to anon
  using (true);

create policy "anon_read_applications"
  on public.applications
  for select
  to anon
  using (true);

create policy "anon_read_events"
  on public.events
  for select
  to anon
  using (true);

create policy "anon_read_opportunities"
  on public.opportunities
  for select
  to anon
  using (true);

-- 4. (Optional) Allow anon to write — useful for the dev panel and the
--    SendOfferButton prototype. Remove or restrict before production.
drop policy if exists "anon_write_registrations" on public.registrations;
create policy "anon_write_registrations"
  on public.registrations
  for insert
  to anon
  with check (true);

drop policy if exists "anon_update_registrations" on public.registrations;
create policy "anon_update_registrations"
  on public.registrations
  for update
  to anon
  using (true)
  with check (true);

-- 5. Quick sanity check — list every policy that just got created.
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
