create schema if not exists private;

create type public.user_role as enum ('user', 'admin');
create type public.study_mode as enum ('focus', 'short', 'long');
create type public.task_priority as enum ('low', 'normal', 'high');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role public.user_role not null default 'user',
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  focus_minutes integer not null default 25 check (focus_minutes between 1 and 180),
  short_break_minutes integer not null default 5 check (short_break_minutes between 1 and 60),
  long_break_minutes integer not null default 20 check (long_break_minutes between 1 and 120),
  daily_goal_minutes integer not null default 90 check (daily_goal_minutes between 1 and 1440),
  dark_mode boolean not null default false,
  auto_cycle boolean not null default false,
  ambient text not null default 'library',
  chime boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  text text not null check (char_length(text) between 1 and 280),
  done boolean not null default false,
  priority public.task_priority not null default 'normal',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  topic_name text,
  task_name text,
  minutes integer not null check (minutes between 1 and 1440),
  mode public.study_mode not null default 'focus',
  focus_score integer check (focus_score between 1 and 5),
  studied_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);
create index profiles_last_seen_idx on public.profiles(last_seen_at desc);
create index topics_user_idx on public.topics(user_id, position);
create index tasks_user_done_idx on public.tasks(user_id, done, updated_at desc);
create index study_sessions_user_date_idx on public.study_sessions(user_id, studied_on desc);
create index admin_audit_actor_idx on public.admin_audit_logs(actor_id, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function private.set_updated_at();

create trigger topics_set_updated_at
before update on public.topics
for each row execute function private.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function private.set_updated_at();

create or replace function private.protect_profile_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.is_suspended is distinct from old.is_suspended)
     and not private.is_admin(auth.uid()) then
    raise exception 'Only admins can change role or suspension status.';
  end if;

  return new;
end;
$$;

create trigger profiles_protect_admin_fields
before update on public.profiles
for each row execute function private.protect_profile_admin_fields();

create or replace function private.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
      and is_suspended = false
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1))
  );

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.topics enable row level security;
alter table public.tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "Users can read their profile"
on public.profiles for select
to authenticated
using (auth.uid() = id or private.is_admin(auth.uid()));

create policy "Users can update their display profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can update managed profile fields"
on public.profiles for update
to authenticated
using (private.is_admin(auth.uid()))
with check (private.is_admin(auth.uid()));

create policy "Users manage their settings"
on public.user_settings for all
to authenticated
using (auth.uid() = user_id or private.is_admin(auth.uid()))
with check (auth.uid() = user_id or private.is_admin(auth.uid()));

create policy "Users manage their topics"
on public.topics for all
to authenticated
using (auth.uid() = user_id or private.is_admin(auth.uid()))
with check (auth.uid() = user_id);

create policy "Users manage their tasks"
on public.tasks for all
to authenticated
using (auth.uid() = user_id or private.is_admin(auth.uid()))
with check (auth.uid() = user_id);

create policy "Users manage their study sessions"
on public.study_sessions for all
to authenticated
using (auth.uid() = user_id or private.is_admin(auth.uid()))
with check (auth.uid() = user_id);

create policy "Admins read audit logs"
on public.admin_audit_logs for select
to authenticated
using (private.is_admin(auth.uid()));

create policy "Admins insert audit logs"
on public.admin_audit_logs for insert
to authenticated
with check (private.is_admin(auth.uid()));

grant usage on schema private to authenticated;
grant execute on function private.is_admin(uuid) to authenticated;
