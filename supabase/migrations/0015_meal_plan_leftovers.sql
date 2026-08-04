alter table public.meal_plans
add column leftover_from date;

alter table public.meal_plans
add constraint meal_plans_leftover_before_planned_date
check (leftover_from is null or leftover_from < planned_for);
