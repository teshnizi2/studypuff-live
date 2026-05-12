-- Phase-1 schema for "rooms live inside the dashboard":
--   (a) Owner gets auto-added to study_room_members on room creation, so the
--       chat policy ("must be a member to post") doesn't exclude room owners.
--   (b) study_rooms gets timer columns so the owner's Pomodoro state can be
--       broadcast to all members via Realtime. The UI wiring lands in a
--       follow-up commit; declaring the schema now avoids a second migration.
--   (c) REPLICA IDENTITY FULL on the chat/timer tables so Realtime UPDATE
--       events ship the full old/new row and policies can filter them.

-- (a) auto-membership trigger
create or replace function private.add_owner_as_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.study_room_members (room_id, user_id)
  values (new.id, new.owner_id)
  on conflict (room_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists study_rooms_owner_membership on public.study_rooms;
create trigger study_rooms_owner_membership
after insert on public.study_rooms
for each row execute function private.add_owner_as_member();

-- backfill: any owner not already a member becomes one
insert into public.study_room_members (room_id, user_id)
select r.id, r.owner_id
from public.study_rooms r
where not exists (
  select 1 from public.study_room_members m
  where m.room_id = r.id and m.user_id = r.owner_id
)
on conflict do nothing;

-- (b) timer state on the room
alter table public.study_rooms
  add column if not exists timer_mode text not null default 'idle'
    check (timer_mode in ('idle','focus','short','long')),
  add column if not exists timer_started_at timestamptz,
  add column if not exists timer_paused_at  timestamptz,
  add column if not exists timer_pause_offset_seconds int not null default 0,
  add column if not exists timer_round int not null default 1,
  add column if not exists short_break_minutes int not null default 5,
  add column if not exists long_break_minutes  int not null default 15;

-- (c) replica identity full — needed for Realtime to deliver UPDATE events
-- with enough columns to evaluate per-user RLS filtering.
alter table public.room_messages       replica identity full;
alter table public.study_rooms         replica identity full;
alter table public.study_room_members  replica identity full;
