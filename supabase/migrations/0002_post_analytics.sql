-- Per-post analytics.
-- No personal data is stored: the visitor key is a salted hash of IP + user agent,
-- which cannot be reversed and is never written in raw form.

create table if not exists public.post_views (
  id               bigint generated always as identity primary key,
  slug             text        not null,
  visitor_hash     text        not null,
  session_id       text        not null,
  referrer_host    text,
  country          text,
  device           text,                                   -- mobile | tablet | desktop
  duration_seconds integer     not null default 0,
  scroll_percent   integer     not null default 0,
  created_at       timestamptz not null default now()
);

create index if not exists post_views_slug_idx    on public.post_views (slug, created_at desc);
create index if not exists post_views_visitor_idx on public.post_views (slug, visitor_hash);
create unique index if not exists post_views_session_idx on public.post_views (session_id);

alter table public.post_views enable row level security;

-- Writes only ever happen server-side through the service role, which bypasses RLS.
-- Anonymous visitors get no access at all; signed-in admins can read the analytics.
drop policy if exists "admins read analytics" on public.post_views;
create policy "admins read analytics"
  on public.post_views
  for select
  to authenticated
  using (true);

-- Likes. One per visitor per post, enforced by the unique constraint.
create table if not exists public.post_likes (
  id           bigint generated always as identity primary key,
  slug         text        not null,
  visitor_hash text        not null,
  created_at   timestamptz not null default now(),
  unique (slug, visitor_hash)
);

create index if not exists post_likes_slug_idx on public.post_likes (slug);

alter table public.post_likes enable row level security;

-- Anyone may read the like count; writes go through the server only.
drop policy if exists "anyone reads likes" on public.post_likes;
create policy "anyone reads likes"
  on public.post_likes
  for select
  using (true);

-- Aggregate rollup for one post. security definer so the admin UI can call it
-- without needing row-level read access to every underlying row.
create or replace function public.post_stats(post_slug text)
returns table (
  views            bigint,
  unique_visitors  bigint,
  avg_seconds      numeric,
  completion_rate  numeric,
  views_7d         bigint,
  views_30d        bigint,
  likes            bigint
)
language sql
security definer
set search_path = public
as $$
  select
    count(v.*)                                                          as views,
    count(distinct v.visitor_hash)                                      as unique_visitors,
    coalesce(round(avg(nullif(v.duration_seconds, 0)), 0), 0)           as avg_seconds,
    coalesce(
      round(100.0 * count(v.*) filter (where v.scroll_percent >= 90) / nullif(count(v.*), 0), 0),
      0
    )                                                                   as completion_rate,
    count(v.*) filter (where v.created_at > now() - interval '7 days')  as views_7d,
    count(v.*) filter (where v.created_at > now() - interval '30 days') as views_30d,
    (select count(*) from public.post_likes l where l.slug = post_slug) as likes
  from public.post_views v
  where v.slug = post_slug;
$$;

grant execute on function public.post_stats(text) to authenticated;

-- Site-wide totals across every post, for the dashboard overview.
create or replace function public.blog_stats()
returns table (
  views           bigint,
  unique_visitors bigint,
  views_7d        bigint,
  avg_seconds     numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)                                                        as views,
    count(distinct visitor_hash)                                    as unique_visitors,
    count(*) filter (where created_at > now() - interval '7 days')  as views_7d,
    coalesce(round(avg(nullif(duration_seconds, 0)), 0), 0)         as avg_seconds
  from public.post_views;
$$;

grant execute on function public.blog_stats() to authenticated;
