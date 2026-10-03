-- 1. Make bucket public (allowed)
update storage.buckets
set public = true
where id = 'portfolio';

-- 2. Public read access
drop policy if exists "Public Access Portfolio" on storage.objects;
create policy "Public Access Portfolio"
on storage.objects
for select
using (bucket_id = 'portfolio');

-- 3. Uploads (authenticated users only)
drop policy if exists "Authenticated Upload Portfolio" on storage.objects;
create policy "Authenticated Upload Portfolio"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio');

-- 4. Updates
drop policy if exists "Authenticated Update Portfolio" on storage.objects;
create policy "Authenticated Update Portfolio"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio');

-- 5. Deletes
drop policy if exists "Authenticated Delete Portfolio" on storage.objects;
create policy "Authenticated Delete Portfolio"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio');
