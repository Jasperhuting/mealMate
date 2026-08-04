drop policy if exists "members can add household ratings"
on public.household_recipe_ratings;

drop policy if exists "members can update household ratings"
on public.household_recipe_ratings;

drop policy if exists "members can delete household ratings"
on public.household_recipe_ratings;

create policy "people can add their own household ratings"
on public.household_recipe_ratings for insert to authenticated
with check (
  public.can_access_recipe(recipe_id)
  and exists (
    select 1
    from public.household_people as person
    where person.id = person_id
      and person.linked_user_id = auth.uid()
      and public.is_household_member(person.household_id)
  )
);

create policy "people can update their own household ratings"
on public.household_recipe_ratings for update to authenticated
using (
  exists (
    select 1
    from public.household_people as person
    where person.id = person_id
      and person.linked_user_id = auth.uid()
      and public.is_household_member(person.household_id)
  )
)
with check (
  public.can_access_recipe(recipe_id)
  and exists (
    select 1
    from public.household_people as person
    where person.id = person_id
      and person.linked_user_id = auth.uid()
      and public.is_household_member(person.household_id)
  )
);

create policy "people can delete their own household ratings"
on public.household_recipe_ratings for delete to authenticated
using (
  exists (
    select 1
    from public.household_people as person
    where person.id = person_id
      and person.linked_user_id = auth.uid()
      and public.is_household_member(person.household_id)
  )
);
