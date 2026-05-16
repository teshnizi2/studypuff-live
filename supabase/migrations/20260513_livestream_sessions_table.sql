-- Admin-editable weekly livestream schedule. Public reads active rows;
-- only admins can insert/update/delete. Renders on /study and the
-- home page's 'Live this week' pill.

create table public.livestream_sessions (
  id uuid primary key default gen_random_uuid(),
  day_label      text    not null,
  time_label     text    not null,
  platform_label text    not null default 'YouTube · Twitch',
  topic          text    not null,
  sort_order     int     not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.livestream_sessions enable row level security;

create policy "Anyone can view active livestreams"
  on public.livestream_sessions
  for select
  using (is_active = true);

create policy "Admins can view all livestreams"
  on public.livestream_sessions
  for select
  to authenticated
  using (private.is_admin(auth.uid()));

create policy "Admins insert livestreams"
  on public.livestream_sessions
  for insert to authenticated
  with check (private.is_admin(auth.uid()));
create policy "Admins update livestreams"
  on public.livestream_sessions
  for update to authenticated
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));
create policy "Admins delete livestreams"
  on public.livestream_sessions
  for delete to authenticated
  using (private.is_admin(auth.uid()));

grant select on public.livestream_sessions to anon, authenticated;

create trigger livestream_sessions_set_updated_at
  before update on public.livestream_sessions
  for each row execute function private.set_updated_at();

insert into public.livestream_sessions (day_label, time_label, platform_label, topic, sort_order) values
  ('Monday',  '8:00 AM CET',  'YouTube · Twitch', 'Cozy morning focus', 1),
  ('Tuesday', '12:00 PM CET', 'YouTube · Twitch', 'Deep work',          2),
  ('Friday',  '12:00 PM CET', 'YouTube · Twitch', 'Last focus sprint',  3);
