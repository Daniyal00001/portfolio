alter table education add column if not exists logo_url text;
alter table education add column if not exists website text;

update education
set logo_url = '/assets/logos/gcu.png'
where university ilike '%government college university%';

update education
set logo_url = '/assets/logos/pgc.png'
where university ilike '%punjab college%';

update education
set website = 'https://gcu.edu.pk/'
where university ilike '%government college university%';

update education
set website = 'https://pgc.edu/'
where university ilike '%punjab college%';

notify pgrst, 'reload schema';
