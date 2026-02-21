-- Add persistent onboarding state for profile-level access control.
-- Run in Supabase SQL editor.

begin;

alter table public.profiles
  add column if not exists onboarded boolean not null default false;

update public.profiles
set onboarded = coalesce(onboarded, false)
where onboarded is null;

commit;
