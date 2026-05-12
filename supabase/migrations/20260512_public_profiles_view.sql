-- Co-room-members were showing as "Former member" in chat because the
-- only SELECT policy on profiles is "Users can read their profile"
-- (auth.uid() = id), so getRoomDetail's profile lookup returned nothing
-- for other members → display_name was null → name fallback fired.
--
-- Fix: expose the four public-presentable profile columns through a view
-- that bypasses RLS on profiles (security_invoker=false). Email, bio,
-- school, birthday etc. stay private; only id + display_name + username
-- + avatar_url are readable by other authenticated users.

create or replace view public.public_profiles
with (security_invoker=false)
as
select id, display_name, username, avatar_url
from public.profiles;

grant select on public.public_profiles to authenticated;
