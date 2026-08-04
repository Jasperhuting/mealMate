create table public.household_recipe_seed_deletions (
  household_id uuid not null references public.households(id) on delete cascade,
  client_key text not null,
  deleted_by uuid not null references public.profiles(id),
  deleted_at timestamptz not null default now(),
  primary key (household_id, client_key)
);

alter table public.household_recipe_seed_deletions enable row level security;

create policy "members can read deleted recipe seeds"
on public.household_recipe_seed_deletions for select to authenticated
using (public.is_household_member(household_id));

create policy "members can add deleted recipe seeds"
on public.household_recipe_seed_deletions for insert to authenticated
with check (
  public.is_household_member(household_id)
  and deleted_by = auth.uid()
);

drop policy if exists "creators can delete recipes" on public.recipes;

create policy "household members can delete recipes"
on public.recipes for delete to authenticated
using (
  created_by = auth.uid()
  or (household_id is not null and public.is_household_member(household_id))
);

create or replace function public.delete_recipe(target_recipe_id uuid)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_household_id uuid;
  target_client_key text;
  target_image_path text;
begin
  select household_id, client_key, image_url
  into target_household_id, target_client_key, target_image_path
  from public.recipes
  where id = target_recipe_id;

  if not found or target_household_id is null or not public.is_household_member(target_household_id) then
    raise exception 'Recipe not found or not removable';
  end if;

  if target_client_key is not null then
    insert into public.household_recipe_seed_deletions (
      household_id,
      client_key,
      deleted_by
    )
    values (
      target_household_id,
      target_client_key,
      auth.uid()
    )
    on conflict (household_id, client_key) do nothing;
  end if;

  delete from public.meal_plans where recipe_id = target_recipe_id;
  delete from public.recipes where id = target_recipe_id;

  if not found then
    raise exception 'Recipe not found or not removable';
  end if;

  return target_image_path;
end;
$$;

revoke all on function public.delete_recipe(uuid) from public;
grant execute on function public.delete_recipe(uuid) to authenticated;
