drop policy if exists "creators can update recipes" on public.recipes;
drop policy if exists "recipe creators manage ingredients" on public.recipe_ingredients;

create policy "household members can update recipes"
on public.recipes for update to authenticated
using (
  created_by = auth.uid()
  or (household_id is not null and public.is_household_member(household_id))
)
with check (
  created_by = auth.uid()
  or (household_id is not null and public.is_household_member(household_id))
);

create policy "household members manage recipe ingredients"
on public.recipe_ingredients for all to authenticated
using (
  exists (
    select 1 from public.recipes
    where id = recipe_id
      and (
        created_by = auth.uid()
        or (household_id is not null and public.is_household_member(household_id))
      )
  )
)
with check (
  exists (
    select 1 from public.recipes
    where id = recipe_id
      and (
        created_by = auth.uid()
        or (household_id is not null and public.is_household_member(household_id))
      )
  )
);

create or replace function public.update_recipe_details(
  target_recipe_id uuid,
  new_title text,
  new_description text,
  new_duration_minutes integer,
  new_ingredients jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  previous_shopping_items jsonb;
begin
  update public.recipes
  set
    title = new_title,
    description = new_description,
    duration_minutes = new_duration_minutes,
    updated_at = now()
  where id = target_recipe_id;

  if not found then
    raise exception 'Recipe not found or not editable';
  end if;

  delete from public.recipe_ingredients where recipe_id = target_recipe_id;

  insert into public.recipe_ingredients (
    recipe_id,
    name,
    quantity,
    unit,
    department,
    sort_order
  )
  select
    target_recipe_id,
    ingredient ->> 'name',
    (ingredient ->> 'quantity')::numeric,
    nullif(ingredient ->> 'unit', ''),
    ingredient ->> 'department',
    coalesce((ingredient ->> 'sort_order')::integer, ingredient_index - 1)
  from jsonb_array_elements(new_ingredients) with ordinality as items(ingredient, ingredient_index);

  select coalesce(
    jsonb_object_agg(
      shopping_key,
      jsonb_build_object('department', department, 'is_checked', is_checked)
    ),
    '{}'::jsonb
  )
  into previous_shopping_items
  from (
    select distinct on (lower(items.name), coalesce(items.unit, ''))
      lower(items.name) || '|' || coalesce(items.unit, '') as shopping_key,
      items.department,
      items.is_checked
    from public.shopping_items as items
    join public.meal_plans as plans on plans.id = items.meal_plan_id
    where plans.recipe_id = target_recipe_id
    order by lower(items.name), coalesce(items.unit, ''), items.created_at desc
  ) as existing_items;

  delete from public.shopping_items
  where meal_plan_id in (
    select id from public.meal_plans where recipe_id = target_recipe_id
  );

  insert into public.shopping_items (
    household_id,
    name,
    quantity,
    unit,
    department,
    recipe_id,
    meal_plan_id,
    is_checked,
    added_by
  )
  select
    plans.household_id,
    ingredients.name,
    ingredients.quantity,
    ingredients.unit,
    coalesce(
      previous_shopping_items ->
        (lower(ingredients.name) || '|' || coalesce(ingredients.unit, '')) ->>
        'department',
      ingredients.department
    ),
    target_recipe_id,
    plans.id,
    coalesce(
      (
        previous_shopping_items ->
          (lower(ingredients.name) || '|' || coalesce(ingredients.unit, '')) ->>
          'is_checked'
      )::boolean,
      false
    ),
    auth.uid()
  from public.meal_plans as plans
  cross join public.recipe_ingredients as ingredients
  where plans.recipe_id = target_recipe_id
    and ingredients.recipe_id = target_recipe_id;
end;
$$;

revoke all on function public.update_recipe_details(uuid, text, text, integer, jsonb) from public;
grant execute on function public.update_recipe_details(uuid, text, text, integer, jsonb) to authenticated;
