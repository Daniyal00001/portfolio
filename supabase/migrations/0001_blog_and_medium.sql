-- Blog system + Medium profile link.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- 1. Medium blog link on the profile
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists social_medium text;

update public.profiles
   set social_medium = 'https://faheem506pk.medium.com/'
 where social_medium is null;

-- ---------------------------------------------------------------------------
-- 2. Blog posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id               bigint generated always as identity primary key,
  slug             text        not null unique,
  title            text        not null,
  excerpt          text,
  content          text        not null default '',           -- markdown source
  cover_image_url  text,
  tags             text[]      not null default '{}',
  status           text        not null default 'draft'
                   check (status in ('draft', 'published')),
  published_at     timestamptz,

  -- SEO
  meta_title       text,
  meta_description text,
  og_image_url     text,
  canonical_url    text,
  noindex          boolean     not null default false,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (status, published_at desc);

-- Keep updated_at honest without relying on the client to send it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Row level security
--    Anonymous visitors may read published posts only; drafts stay private.
--    Any signed-in admin user manages everything.
-- ---------------------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "posts are publicly readable when published" on public.posts;
create policy "posts are publicly readable when published"
  on public.posts
  for select
  using (status = 'published');

drop policy if exists "authenticated users manage posts" on public.posts;
create policy "authenticated users manage posts"
  on public.posts
  for all
  to authenticated
  using (true)
  with check (true);
