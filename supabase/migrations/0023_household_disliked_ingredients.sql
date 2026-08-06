create or replace function public.shares_household_with_user(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members as current_membership
    join public.household_members as target_membership
      on target_membership.household_id = current_membership.household_id
    where current_membership.user_id = auth.uid()
      and target_membership.user_id = target_user_id
  );
$$;

revoke all on function public.shares_household_with_user(uuid) from public;
grant execute on function public.shares_household_with_user(uuid) to authenticated;

drop policy if exists "users can read their own disliked ingredients"
on public.user_disliked_ingredients;

create policy "household members can read disliked ingredients"
on public.user_disliked_ingredients for select to authenticated
using (
  user_id = auth.uid()
  or public.shares_household_with_user(user_id)
);
