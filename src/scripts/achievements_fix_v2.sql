-- FINAL FIX for Achievements RLS
-- Run this in Supabase SQL Editor

-- 1. Ensure RLS is active
alter table achievements enable row level security;

-- 2. Drop all conflicting policies
drop policy if exists "Authenticated users can manage achievements" on achievements;
drop policy if exists "Public achievements are viewable by everyone." on achievements;
drop policy if exists "Users can insert their own achievements." on achievements;
drop policy if exists "Users can update their own achievements." on achievements;
drop policy if exists "Users can delete their own achievements." on achievements;

-- 3. Create CLEAN policies
-- Allow everyone to read
create policy "allow_public_read"
on achievements for select
to public
using (true);

-- Allow authenticated to do EVERYTHING
create policy "allow_authenticated_all"
on achievements for all
to authenticated
using (true)
with check (true);

-- 4. Grant explicit table permissions
grant all on table achievements to authenticated;
grant select on table achievements to anon;
grant usage on schema public to authenticated, anon;

-- Extra: Ensure the ID generation is handled
alter table achievements alter column id set default gen_random_uuid();
