-- Fix infinite-recursion RLS error on study_room_members:
-- the SELECT policy self-referenced the same table, so any SELECT that
-- transitively touched study_room_members (e.g. an INSERT...RETURNING on
-- study_rooms which checks the related-rooms SELECT policy) blew up with
-- ERROR 42P17. The fix is a SECURITY DEFINER helper that does the
-- membership lookup without RLS, then policies call the helper instead
-- of self-querying the table.

create or replace function private.is_room_member(p_room_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.study_room_members
    where room_id = p_room_id and user_id = p_user_id
  );
$$;

grant execute on function private.is_room_member(uuid, uuid) to authenticated;

-- study_room_members: replace self-referencing SELECT policy
drop policy if exists "Members can view co-members" on public.study_room_members;
create policy "Members can view co-members" on public.study_room_members
for select
using (
  user_id = auth.uid()
  or private.is_room_member(room_id, auth.uid())
  or exists (
    select 1 from public.study_rooms r
    where r.id = study_room_members.room_id and r.owner_id = auth.uid()
  )
  or private.is_admin(auth.uid())
);

-- study_rooms: rewrite SELECT policy to use the helper instead of
-- directly subquerying study_room_members. Functionally equivalent,
-- avoids the recursion chain when the planner expands policies.
drop policy if exists "Members can view their rooms" on public.study_rooms;
create policy "Members can view their rooms" on public.study_rooms
for select
using (
  owner_id = auth.uid()
  or private.is_room_member(id, auth.uid())
  or private.is_admin(auth.uid())
);

-- room_messages policies: same recursion risk — switch them to the helper.
drop policy if exists "Members can read room messages" on public.room_messages;
create policy "Members can read room messages" on public.room_messages
for select
using (
  private.is_room_member(room_id, auth.uid())
  or private.is_admin(auth.uid())
);

drop policy if exists "Members can post messages" on public.room_messages;
create policy "Members can post messages" on public.room_messages
for insert
with check (
  user_id = auth.uid()
  and private.is_room_member(room_id, auth.uid())
);
