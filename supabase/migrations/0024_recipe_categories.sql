alter table public.recipes
add column category text not null default 'Hoofdgerecht'
check (
  category in (
    'Ontbijt',
    'Lunch',
    'Voorgerecht',
    'Hoofdgerecht',
    'Bijgerecht',
    'Dessert',
    'Tussendoortje'
  )
);

create index recipes_household_category_idx
on public.recipes (household_id, category);

create or replace function public.update_recipe_details(
  target_recipe_id uuid,
  new_title text,
  new_description text,
  new_category text,
  new_duration_minutes integer,
  new_ingredients jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new_category not in (
    'Ontbijt',
    'Lunch',
    'Voorgerecht',
    'Hoofdgerecht',
    'Bijgerecht',
    'Dessert',
    'Tussendoortje'
  ) then
    raise exception 'Invalid recipe category';
  end if;

  perform public.update_recipe_details(
    target_recipe_id,
    new_title,
    new_description,
    new_duration_minutes,
    new_ingredients
  );

  update public.recipes
  set category = new_category
  where id = target_recipe_id;
end;
$$;

revoke all on function public.update_recipe_details(uuid, text, text, text, integer, jsonb) from public;
grant execute on function public.update_recipe_details(uuid, text, text, text, integer, jsonb) to authenticated;
