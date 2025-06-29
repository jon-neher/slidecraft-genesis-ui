-- Create deck_blueprints table for storing user-defined slide blueprints

create table if not exists public.deck_blueprints (
  blueprint_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  blueprint jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.deck_blueprints enable row level security;

-- Policies allowing users to manage their own blueprints
create policy "deck_blueprints_select" on public.deck_blueprints
  for select using ((auth.jwt() ->> 'sub')::uuid = user_id);

create policy "deck_blueprints_insert" on public.deck_blueprints
  for insert with check ((auth.jwt() ->> 'sub')::uuid = user_id);

create policy "deck_blueprints_update" on public.deck_blueprints
  for update using ((auth.jwt() ->> 'sub')::uuid = user_id);

create policy "deck_blueprints_delete" on public.deck_blueprints
  for delete using ((auth.jwt() ->> 'sub')::uuid = user_id);
