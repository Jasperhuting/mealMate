insert into public.meal_plan_people (meal_plan_id, person_id)
select plans.id, people.id
from public.meal_plans as plans
join public.household_people as people
  on people.household_id = plans.household_id
where not exists (
  select 1
  from public.meal_plan_people as existing_assignment
  where existing_assignment.meal_plan_id = plans.id
)
and (
  not exists (
    select 1
    from public.meal_attendance as any_attendance
    where any_attendance.household_id = plans.household_id
      and any_attendance.planned_for = plans.planned_for
  )
  or exists (
    select 1
    from public.meal_attendance as eating_attendance
    where eating_attendance.household_id = plans.household_id
      and eating_attendance.planned_for = plans.planned_for
      and eating_attendance.person_id = people.id
      and eating_attendance.is_eating
  )
)
on conflict do nothing;
