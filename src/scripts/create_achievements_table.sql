-- Create the 'achievements' table
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

-- Enable Row Level Security (RLS)
alter table achievements enable row level security;

-- Create policies
-- Allow public read access
create policy "Public achievements are viewable by everyone."
  on achievements for select
  using ( true );

-- Allow authenticated users to insert, update, delete
create policy "Users can insert their own achievements."
  on achievements for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own achievements."
  on achievements for update
  using ( auth.role() = 'authenticated' );

create policy "Users can delete their own achievements."
  on achievements for delete
  using ( auth.role() = 'authenticated' );
