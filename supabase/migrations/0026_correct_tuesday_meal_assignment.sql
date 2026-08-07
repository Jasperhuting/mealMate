insert into public.meal_plan_people (meal_plan_id, person_id)
select plans.id, people.id
from public.meal_plans as plans
join public.household_people as people
  on people.household_id = plans.household_id
where plans.id = '307f80ba-02af-4a59-aec8-8d1f991d8a9a'
and not exists (
  select 1
  from public.meal_attendance as attendance
  where attendance.household_id = plans.household_id
    and attendance.planned_for = plans.planned_for
    and attendance.person_id = people.id
    and not attendance.is_eating
)
on conflict do nothing;
