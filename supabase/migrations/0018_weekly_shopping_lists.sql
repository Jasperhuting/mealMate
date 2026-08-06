alter table public.shopping_items
add column week_start date,
add column carried_from_week date;

update public.shopping_items as items
set week_start = (
  plans.planned_for
  - (extract(isodow from plans.planned_for)::integer - 1)
)
from public.meal_plans as plans
where plans.id = items.meal_plan_id;

update public.shopping_items
set week_start = date_trunc('week', created_at)::date
where week_start is null;

alter table public.shopping_items
alter column week_start set default date_trunc('week', current_date::timestamp)::date,
alter column week_start set not null;

create index shopping_items_household_week_idx
on public.shopping_items (household_id, week_start);

create unique index shopping_items_unique_weekly_carry_idx
on public.shopping_items (
  household_id,
  week_start,
  carried_from_week,
  lower(name),
  coalesce(unit, '')
)
where meal_plan_id is null and carried_from_week is not null;

create or replace function public.set_shopping_item_week_start()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.meal_plan_id is not null then
    select
      plans.planned_for
      - (extract(isodow from plans.planned_for)::integer - 1)
    into new.week_start
    from public.meal_plans as plans
    where plans.id = new.meal_plan_id;
  elsif new.week_start is null then
    new.week_start := date_trunc('week', current_date::timestamp)::date;
  end if;

  return new;
end;
$$;

create trigger set_shopping_item_week_start
before insert or update of meal_plan_id on public.shopping_items
for each row execute function public.set_shopping_item_week_start();
