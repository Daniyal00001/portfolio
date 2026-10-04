-- Adds a picture for each skill without dropping existing rows.
alter table skills add column if not exists entries jsonb not null default '[]'::jsonb;

update skills as target
set entries = grouped.entries
from (
  select
    skills.id,
    coalesce(
      jsonb_agg(
        jsonb_build_object('name', item, 'image', '')
        order by ord
      ),
      '[]'::jsonb
    ) as entries
  from skills
  cross join lateral unnest(skills.items) with ordinality as listed(item, ord)
  group by skills.id
) as grouped
where target.id = grouped.id
  and target.entries = '[]'::jsonb;
