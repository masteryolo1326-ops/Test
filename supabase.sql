-- ==========================
-- SQL PARA SUPABASE (RLS ON)
-- ==========================
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  candidate_id int not null check (candidate_id between 1 and 4),
  created_at timestamp with time zone default now(),
  unique (user_id) -- 1 voto por usuario
);

alter table public.votes enable row level security;

create policy "insert own vote"
on public.votes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "read votes"
on public.votes for select
to authenticated
using (true);

create policy "no updates" on public.votes for update to authenticated using (false) with check (false);
create policy "no deletes" on public.votes for delete to authenticated using (false);

-- Configura en Auth > Providers > Email:
-- - Confirmación por correo
-- - URL de redirección permitida (emailRedirectTo)
