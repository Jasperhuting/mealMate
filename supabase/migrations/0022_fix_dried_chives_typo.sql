update public.recipe_ingredients
set name = 'gedroogde bieslook'
where name = 'gedoogde bieslook';

do $$
begin
  if exists (
    select 1
    from public.recipe_ingredients
    where name = 'gedoogde bieslook'
  ) then
    raise exception 'Ingredient typo was not fully corrected';
  end if;
end;
$$;
