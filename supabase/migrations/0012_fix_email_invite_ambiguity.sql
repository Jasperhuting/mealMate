create or replace function public.prepare_household_email_invite(
  invite_email text,
  invite_name text
)
returns table(invite_id uuid, person_id uuid, household_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_household_id uuid;
  normalized_email text := lower(trim(invite_email));
  normalized_name text := trim(invite_name);
  selected_person_id uuid;
  selected_invite_id uuid;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Vul een geldig e-mailadres in';
  end if;
  if char_length(normalized_name) < 1 or char_length(normalized_name) > 80 then
    raise exception 'Vul een naam in';
  end if;

  current_household_id := public.ensure_current_user_household();

  select person.id into selected_person_id
  from public.household_people as person
  where person.household_id = current_household_id
    and lower(person.email) = normalized_email;

  if selected_person_id is null then
    insert into public.household_people (
      household_id, display_name, initials, color, email, invitation_status
    ) values (
      current_household_id,
      normalized_name,
      public.person_initials(normalized_name),
      '#8B6F47',
      normalized_email,
      'pending'
    ) returning id into selected_person_id;
  else
    update public.household_people as person
    set display_name = normalized_name,
        initials = public.person_initials(normalized_name),
        invitation_status = case when person.linked_user_id is null then 'pending' else 'accepted' end
    where person.id = selected_person_id;
  end if;

  select invite.id into selected_invite_id
  from public.household_email_invites as invite
  where invite.household_id = current_household_id
    and lower(invite.email) = normalized_email
    and invite.accepted_at is null
  for update;

  if selected_invite_id is null then
    insert into public.household_email_invites (
      household_id, person_id, email, display_name, invited_by
    ) values (
      current_household_id, selected_person_id, normalized_email, normalized_name, current_user_id
    ) returning id into selected_invite_id;
  else
    update public.household_email_invites as invite
    set person_id = selected_person_id,
        display_name = normalized_name,
        invited_by = current_user_id,
        expires_at = now() + interval '7 days',
        created_at = now()
    where invite.id = selected_invite_id;
  end if;

  return query select selected_invite_id, selected_person_id, current_household_id;
end;
$$;

revoke all on function public.prepare_household_email_invite(text, text) from public;
grant execute on function public.prepare_household_email_invite(text, text) to authenticated;
