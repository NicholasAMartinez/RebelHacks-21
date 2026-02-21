-- Seed/normalization script for current schema.
-- This script does NOT insert demo/sample item cards.
--
-- Run in Supabase SQL Editor.

begin;

-- Fill missing profile values without overwriting existing custom values.
update public.profiles
set
  name = coalesce(name, 'Player ' || left(id::text, 8)),
  wins = coalesce(wins, 0),
  "totalBets" = coalesce("totalBets", 0),
  onboarded = coalesce(onboarded, false)
where name is null or wins is null or "totalBets" is null or onboarded is null;

commit;
