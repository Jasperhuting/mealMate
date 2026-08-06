create or replace function public.update_household_person(
  target_person_id uuid,
  new_display_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_person public.household_people%rowtype;
  normalized_name text := trim(new_display_name);
begin
  if auth.uid() is null then raise exception 'Log eerst in bij Tably.'; end if;
  if char_length(normalized_name) < 1 or char_length(normalized_name) > 80 then
    raise exception 'De naam moet tussen 1 en 80 tekens lang zijn.';
  end if;

  select * into selected_person
  from public.household_people
  where id = target_person_id;

  if selected_person.id is null or not public.is_household_member(selected_person.household_id) then
    raise exception 'Dit gezinslid kon niet worden gevonden.';
  end if;

  if exists (
    select 1
    from public.household_people
    where household_id = selected_person.household_id
      and lower(display_name) = lower(normalized_name)
      and id <> target_person_id
  ) then
    raise exception 'Er bestaat al een gezinslid met deze naam.';
  end if;

  update public.household_people
  set display_name = normalized_name,
      initials = public.person_initials(normalized_name)
  where id = target_person_id;

  update public.household_email_invites
  set display_name = normalized_name
  where person_id = target_person_id
    and accepted_at is null;
end;
$$;

create or replace function public.remove_household_person(target_person_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_person public.household_people%rowtype;
  household_creator uuid;
begin
  if auth.uid() is null then raise exception 'Log eerst in bij Tably.'; end if;

  select * into selected_person
  from public.household_people
  where id = target_person_id;

  if selected_person.id is null or not public.is_household_owner(selected_person.household_id) then
    raise exception 'Alleen de beheerder kan een gezinslid verwijderen.';
  end if;

  select created_by into household_creator
  from public.households
  where id = selected_person.household_id;

  if selected_person.linked_user_id = auth.uid() or selected_person.linked_user_id = household_creator then
    raise exception 'Je kunt de beheerder van het gezin niet verwijderen.';
  end if;

  if selected_person.linked_user_id is not null then
    delete from public.household_members
    where household_id = selected_person.household_id
      and user_id = selected_person.linked_user_id;
  end if;

  delete from public.household_people
  where id = target_person_id;
end;
$$;

revoke all on function public.update_household_person(uuid, text) from public;
revoke all on function public.remove_household_person(uuid) from public;
grant execute on function public.update_household_person(uuid, text) to authenticated;
grant execute on function public.remove_household_person(uuid) to authenticated;
