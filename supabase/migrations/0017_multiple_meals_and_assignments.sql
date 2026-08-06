alter table public.meal_plans
drop constraint meal_plans_household_id_planned_for_key;

alter table public.meal_plans
add constraint meal_plans_household_date_recipe_key
unique (household_id, planned_for, recipe_id);

create table public.meal_plan_people (
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade,
  person_id uuid not null references public.household_people(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (meal_plan_id, person_id)
);

insert into public.meal_plan_people (meal_plan_id, person_id)
select plans.id, people.id
from public.meal_plans as plans
join public.household_people as people on people.household_id = plans.household_id
left join public.meal_attendance as attendance
  on attendance.household_id = plans.household_id
  and attendance.planned_for = plans.planned_for
  and attendance.person_id = people.id
where coalesce(attendance.is_eating, true)
on conflict do nothing;

create index meal_plan_people_person_idx
on public.meal_plan_people (person_id);

alter table public.meal_plan_people enable row level security;

create policy "members can read meal assignments"
on public.meal_plan_people for select to authenticated
using (
  exists (
    select 1
    from public.meal_plans as plans
    where plans.id = meal_plan_id
      and public.is_household_member(plans.household_id)
  )
);

create policy "members can add meal assignments"
on public.meal_plan_people for insert to authenticated
with check (
  exists (
    select 1
    from public.meal_plans as plans
    join public.household_people as people
      on people.id = person_id
      and people.household_id = plans.household_id
    where plans.id = meal_plan_id
      and public.is_household_member(plans.household_id)
  )
);

create policy "members can remove meal assignments"
on public.meal_plan_people for delete to authenticated
using (
  exists (
    select 1
    from public.meal_plans as plans
    where plans.id = meal_plan_id
      and public.is_household_member(plans.household_id)
  )
);
