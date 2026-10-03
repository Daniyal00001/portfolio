-- Editable site copy and image URLs, stored on the profile row.
alter table public.profiles
  add column if not exists content jsonb not null default '{}'::jsonb;

notify pgrst, 'reload schema';
