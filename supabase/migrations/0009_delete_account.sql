create or replace function public.delete_current_user_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  owned_household record;
  successor_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  for owned_household in
    select household.id
    from public.households as household
    where household.created_by = current_user_id
  loop
    select member.user_id
    into successor_id
    from public.household_members as member
    where member.household_id = owned_household.id
      and member.user_id <> current_user_id
    order by member.joined_at
    limit 1;

    if successor_id is null then
      delete from public.households
      where id = owned_household.id;
    else
      update public.households
      set created_by = successor_id
      where id = owned_household.id;

      update public.household_members
      set role = 'owner'
      where household_id = owned_household.id
        and user_id = successor_id;
    end if;

    successor_id := null;
  end loop;

  delete from public.meal_plan_exclusions
  where excluded_by = current_user_id;

  delete from public.meal_plans
  where added_by = current_user_id
     or recipe_id in (
       select recipe.id
       from public.recipes as recipe
       where recipe.created_by = current_user_id
     );

  delete from public.shopping_items
  where added_by = current_user_id;

  delete from public.recipes
  where created_by = current_user_id;

  delete from public.household_members
  where user_id = current_user_id;

  delete from public.profiles
  where id = current_user_id;

  delete from auth.users
  where id = current_user_id;
end;
$$;

revoke all on function public.delete_current_user_account() from public, anon, authenticated;
grant execute on function public.delete_current_user_account() to authenticated;
