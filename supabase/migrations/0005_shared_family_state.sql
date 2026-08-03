alter table public.recipes add column client_key text;
create unique index recipes_household_client_key_idx
on public.recipes (household_id, client_key)
where client_key is not null;

create table public.household_people (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  initials text not null check (char_length(initials) between 1 and 4),
  color text not null,
  linked_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (household_id, display_name)
);

create table public.household_recipe_ratings (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  person_id uuid not null references public.household_people(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (recipe_id, person_id)
);

alter table public.household_people enable row level security;
alter table public.household_recipe_ratings enable row level security;

create policy "members can read household people"
on public.household_people for select to authenticated
using (public.is_household_member(household_id));

create policy "members can add household people"
on public.household_people for insert to authenticated
with check (public.is_household_member(household_id));

create policy "members can update household people"
on public.household_people for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "members can delete household people"
on public.household_people for delete to authenticated
using (public.is_household_member(household_id));

create policy "members can read household ratings"
on public.household_recipe_ratings for select to authenticated
using (
  exists (
    select 1
    from public.household_people
    where id = person_id
      and public.is_household_member(household_id)
  )
);

create policy "members can add household ratings"
on public.household_recipe_ratings for insert to authenticated
with check (
  public.can_access_recipe(recipe_id)
  and exists (
    select 1
    from public.household_people
    where id = person_id
      and public.is_household_member(household_id)
  )
);

create policy "members can update household ratings"
on public.household_recipe_ratings for update to authenticated
using (
  exists (
    select 1
    from public.household_people
    where id = person_id
      and public.is_household_member(household_id)
  )
)
with check (
  public.can_access_recipe(recipe_id)
  and exists (
    select 1
    from public.household_people
    where id = person_id
      and public.is_household_member(household_id)
  )
);

create policy "members can delete household ratings"
on public.household_recipe_ratings for delete to authenticated
using (
  exists (
    select 1
    from public.household_people
    where id = person_id
      and public.is_household_member(household_id)
  )
);
