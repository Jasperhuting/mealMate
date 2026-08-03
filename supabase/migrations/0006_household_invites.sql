alter table public.profiles
add column active_household_id uuid references public.households(id) on delete set null;

update public.profiles as profile
set active_household_id = (
  select member.household_id
  from public.household_members as member
  where member.user_id = profile.id
  order by member.joined_at
  limit 1
);

create table public.household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  code text not null unique check (code ~ '^[A-F0-9]{8}$'),
  created_by uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '7 days'),
  redeemed_by uuid references public.profiles(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index household_invites_household_id_idx
on public.household_invites (household_id, created_at desc);

alter table public.household_invites enable row level security;

create policy "members can read household invites"
on public.household_invites for select to authenticated
using (public.is_household_member(household_id));

create policy "members can create household invites"
on public.household_invites for insert to authenticated
with check (
  public.is_household_member(household_id)
  and created_by = auth.uid()
);

create policy "invite creators can delete household invites"
on public.household_invites for delete to authenticated
using (created_by = auth.uid());

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

  select profile.active_household_id
  into household_id
  from public.profiles as profile
  where profile.id = current_user_id
    and exists (
      select 1
      from public.household_members as member
      where member.household_id = profile.active_household_id
        and member.user_id = current_user_id
    );

  if household_id is not null then
    return household_id;
  end if;

  select member.household_id
  into household_id
  from public.household_members as member
  where member.user_id = current_user_id
  order by member.joined_at
  limit 1;

  if household_id is null then
    insert into public.households (name, created_by)
    values ('Ons gezin', current_user_id)
    returning id into household_id;
  end if;

  update public.profiles
  set active_household_id = household_id
  where id = current_user_id;

  return household_id;
end;
$$;

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
    generated_code := upper(encode(gen_random_bytes(4), 'hex'));
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

create or replace function public.join_household_with_code(invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_code text := upper(regexp_replace(invite_code, '[^a-zA-Z0-9]', '', 'g'));
  selected_invite public.household_invites%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select invite.*
  into selected_invite
  from public.household_invites as invite
  where invite.code = normalized_code
    and invite.redeemed_at is null
    and invite.expires_at > now()
  for update;

  if selected_invite.id is null then
    raise exception 'Deze uitnodigingscode is ongeldig of verlopen';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (selected_invite.household_id, current_user_id, 'member')
  on conflict (household_id, user_id) do nothing;

  update public.profiles
  set active_household_id = selected_invite.household_id
  where id = current_user_id;

  update public.household_invites
  set redeemed_by = current_user_id,
      redeemed_at = now()
  where id = selected_invite.id;

  return selected_invite.household_id;
end;
$$;

revoke all on function public.create_household_invite() from public;
revoke all on function public.join_household_with_code(text) from public;
revoke all on function public.ensure_current_user_household() from public;
grant execute on function public.create_household_invite() to authenticated;
grant execute on function public.join_household_with_code(text) to authenticated;
grant execute on function public.ensure_current_user_household() to authenticated;
