create or replace function public.ensure_current_user_household()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  household_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select household_members.household_id
  into household_id
  from public.household_members
  where household_members.user_id = current_user_id
  order by household_members.joined_at
  limit 1;

  if household_id is not null then
    return household_id;
  end if;

  insert into public.households (name, created_by)
  values ('Ons gezin', current_user_id)
  returning id into household_id;

  return household_id;
end;
$$;

revoke all on function public.ensure_current_user_household() from public;
grant execute on function public.ensure_current_user_household() to authenticated;
