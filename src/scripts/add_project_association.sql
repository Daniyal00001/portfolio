alter table projects add column if not exists associated_with text;
alter table projects add column if not exists sort_order integer;
alter table projects add column if not exists visible boolean not null default true;

notify pgrst, 'reload schema';
