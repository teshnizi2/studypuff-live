-- Resolve a profile.username to the auth.users email, so the login form
-- can accept either a username or an email. SECURITY DEFINER because
-- profiles RLS hides other users' rows from anon/authenticated and
-- auth.users is locked down entirely. Only returns email-or-null, no
-- other private fields. Lives in public so PostgREST exposes it via
-- supabase-js .rpc().

create or replace function public.email_for_username(p_username text)
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select u.email
  from auth.users u
  join public.profiles p on p.id = u.id
  where p.username = p_username
  limit 1;
$$;

grant execute on function public.email_for_username(text) to anon, authenticated;
