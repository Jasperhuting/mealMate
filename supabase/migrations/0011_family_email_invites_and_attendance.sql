alter table public.household_people
add column email text,
add column invitation_status text not null default 'accepted'
  check (invitation_status in ('pending', 'accepted'));

create unique index household_people_household_email_idx
on public.household_people (household_id, lower(email))
where email is not null;

create table public.household_email_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  person_id uuid not null references public.household_people(id) on delete cascade,
  email text not null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  invited_by uuid not null references public.profiles(id) on delete cascade,
  accepted_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

create unique index household_email_invites_pending_email_idx
on public.household_email_invites (household_id, lower(email))
where accepted_at is null;

create table public.meal_attendance (
  household_id uuid not null references public.households(id) on delete cascade,
  planned_for date not null,
  person_id uuid not null references public.household_people(id) on delete cascade,
  is_eating boolean not null default true,
  updated_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  primary key (household_id, planned_for, person_id)
);

create index meal_attendance_household_date_idx
on public.meal_attendance (household_id, planned_for);

alter table public.household_email_invites enable row level security;
alter table public.meal_attendance enable row level security;

create policy "members can read household email invites"
on public.household_email_invites for select to authenticated
using (public.is_household_member(household_id));

create policy "members can read attendance"
on public.meal_attendance for select to authenticated
using (public.is_household_member(household_id));

create policy "members can add attendance"
on public.meal_attendance for insert to authenticated
with check (
  public.is_household_member(household_id)
  and updated_by = auth.uid()
  and exists (
    select 1 from public.household_people
    where id = person_id and household_id = meal_attendance.household_id
  )
);

create policy "members can update attendance"
on public.meal_attendance for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id) and updated_by = auth.uid());

create or replace function public.person_initials(display_name text)
returns text
language sql
immutable
set search_path = public
as $$
  select upper(left(regexp_replace(trim(display_name), '(^|\s)(\S)\S*', '\2', 'g'), 4));
$$;

create or replace function public.ensure_household_person_for_member()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  member_name text;
  member_email text;
begin
  select profile.display_name, auth_user.email
  into member_name, member_email
  from public.profiles as profile
  left join auth.users as auth_user on auth_user.id = profile.id
  where profile.id = new.user_id;

  insert into public.household_people (
    household_id,
    display_name,
    initials,
    color,
    linked_user_id,
    email,
    invitation_status
  )
  values (
    new.household_id,
    coalesce(member_name, 'Gezinslid'),
    public.person_initials(coalesce(member_name, 'Gezinslid')),
    '#64746A',
    new.user_id,
    lower(member_email),
    'accepted'
  )
  on conflict (household_id, display_name) do update
  set linked_user_id = excluded.linked_user_id,
      email = coalesce(household_people.email, excluded.email),
      invitation_status = 'accepted';

  return new;
end;
$$;

drop trigger if exists on_household_member_person_sync on public.household_members;
create trigger on_household_member_person_sync
after insert on public.household_members
for each row execute procedure public.ensure_household_person_for_member();

insert into public.household_people (
  household_id,
  display_name,
  initials,
  color,
  linked_user_id,
  email,
  invitation_status
)
select
  member.household_id,
  profile.display_name,
  public.person_initials(profile.display_name),
  '#64746A',
  member.user_id,
  lower(auth_user.email),
  'accepted'
from public.household_members as member
join public.profiles as profile on profile.id = member.user_id
left join auth.users as auth_user on auth_user.id = member.user_id
where not exists (
  select 1 from public.household_people as person
  where person.household_id = member.household_id
    and person.linked_user_id = member.user_id
)
on conflict (household_id, display_name) do update
set linked_user_id = excluded.linked_user_id,
    email = coalesce(household_people.email, excluded.email),
    invitation_status = 'accepted';

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
    update public.household_people
    set display_name = normalized_name,
        initials = public.person_initials(normalized_name),
        invitation_status = case when linked_user_id is null then 'pending' else 'accepted' end
    where id = selected_person_id;
  end if;

  insert into public.household_email_invites (
    household_id, person_id, email, display_name, invited_by
  ) values (
    current_household_id, selected_person_id, normalized_email, normalized_name, current_user_id
  )
  on conflict (household_id, lower(email)) where accepted_at is null
  do update set
    person_id = excluded.person_id,
    display_name = excluded.display_name,
    invited_by = excluded.invited_by,
    expires_at = now() + interval '7 days',
    created_at = now()
  returning id into selected_invite_id;

  return query select selected_invite_id, selected_person_id, current_household_id;
end;
$$;

create or replace function public.accept_household_email_invite(target_invite_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  selected_invite public.household_email_invites%rowtype;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;

  select lower(email) into current_email from auth.users where id = current_user_id;
  select * into selected_invite
  from public.household_email_invites
  where id = target_invite_id
    and accepted_at is null
    and expires_at > now()
  for update;

  if selected_invite.id is null or lower(selected_invite.email) <> current_email then
    raise exception 'Deze uitnodiging is ongeldig of verlopen';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (selected_invite.household_id, current_user_id, 'member')
  on conflict (household_id, user_id) do nothing;

  update public.profiles
  set active_household_id = selected_invite.household_id,
      display_name = selected_invite.display_name
  where id = current_user_id;

  update public.household_people
  set linked_user_id = current_user_id,
      invitation_status = 'accepted'
  where id = selected_invite.person_id;

  update public.household_email_invites
  set accepted_by = current_user_id, accepted_at = now()
  where id = selected_invite.id;

  return selected_invite.household_id;
end;
$$;

revoke all on function public.person_initials(text) from public;
revoke all on function public.prepare_household_email_invite(text, text) from public;
revoke all on function public.accept_household_email_invite(uuid) from public;
grant execute on function public.prepare_household_email_invite(text, text) to authenticated;
grant execute on function public.accept_household_email_invite(uuid) to authenticated;
