update public.recipe_ingredients
set department = 'Vlees, vis en vega'
where department = 'Vega en plantaardig';

update public.shopping_items
set department = 'Vlees, vis en vega'
where department = 'Vega en plantaardig';

do $$
begin
  if exists (
    select 1
    from public.recipe_ingredients
    where department = 'Vega en plantaardig'
  ) or exists (
    select 1
    from public.shopping_items
    where department = 'Vega en plantaardig'
  ) then
    raise exception 'Vega en plantaardig is nog in gebruik';
  end if;
end;
$$;
