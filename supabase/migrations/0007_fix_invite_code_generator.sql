create or replace function public.create_household_invite()
returns table(code text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_household_id uuid;
  generated_code text;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  current_household_id := public.ensure_current_user_household();
  if not public.is_household_member(current_household_id) then
    raise exception 'Household membership required';
  end if;

  loop
    generated_code := upper(encode(extensions.gen_random_bytes(4), 'hex'));
    exit when not exists (
      select 1 from public.household_invites as invite where invite.code = generated_code
    );
  end loop;

  return query
  insert into public.household_invites (household_id, code, created_by)
  values (current_household_id, generated_code, current_user_id)
  returning household_invites.code, household_invites.expires_at;
end;
$$;

revoke all on function public.create_household_invite() from public;
grant execute on function public.create_household_invite() to authenticated;
