-- (1) Fix: Realtime evaluates room_messages SELECT policy using
-- supabase_realtime_admin / anon. They had EXECUTE on private.is_room_member
-- but no USAGE on the private schema, so the function reference failed
-- silently and broadcasts were dropped. Symptom: chat messages only
-- appeared after a full-page refresh.

grant usage on schema private to authenticated, anon, supabase_realtime_admin;

-- (2) Feature: room owners can close the chat. Members can no longer post
-- once closed, but the owner can always post (so they can keep moderating
-- or wrap up the session even after closing). Reading existing history
-- stays open.

alter table public.study_rooms
  add column if not exists chat_closed boolean not null default false;

-- Tighten the "Members can post messages" policy:
--   - the author must be the message's user_id (unchanged)
--   - they must be a member of the room (unchanged)
--   - chat must not be closed, OR the author is the room owner.
drop policy if exists "Members can post messages" on public.room_messages;
create policy "Members can post messages" on public.room_messages
for insert
with check (
  user_id = auth.uid()
  and private.is_room_member(room_id, auth.uid())
  and (
    not coalesce((select chat_closed from public.study_rooms r where r.id = room_messages.room_id), false)
    or exists (
      select 1 from public.study_rooms r
      where r.id = room_messages.room_id and r.owner_id = auth.uid()
    )
  )
);
