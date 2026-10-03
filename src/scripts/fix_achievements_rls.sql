-- Re-create or Fix the 'achievements' table and policies
-- First, ensure the table exists with the right structure
create table if not exists achievements (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('youtube', 'article', 'news', 'award')),
  url text not null,
  title text not null,
  description text,
  thumbnail_url text,
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reset RLS
alter table achievements enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public achievements are viewable by everyone." on achievements;
drop policy if exists "Users can insert their own achievements." on achievements;
drop policy if exists "Users can update their own achievements." on achievements;
drop policy if exists "Users can delete their own achievements." on achievements;

-- Re-apply policies
-- 1. Public can view
create policy "Public achievements are viewable by everyone."
  on achievements for select
  using ( true );

-- 2. Authenticated users can do EVERYTHING (since this is an admin dashboard)
create policy "Authenticated users can manage achievements"
  on achievements for all
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );

-- Ensure the public schema is accessible
grant all on table achievements to authenticated;
grant select on table achievements to anon;
grant usage on schema public to anon, authenticated;
