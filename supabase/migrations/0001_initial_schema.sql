create extension if not exists pgcrypto;

create type public.household_role as enum ('owner', 'member');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.household_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 1 and 140),
  description text,
  instructions jsonb not null default '[]'::jsonb,
  duration_minutes integer check (duration_minutes > 0),
  servings numeric not null default 2 check (servings > 0),
  image_url text,
  source_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  quantity numeric check (quantity >= 0),
  unit text,
  department text not null,
  sort_order integer not null default 0
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete restrict,
  planned_for date not null,
  servings numeric not null default 2 check (servings > 0),
  added_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (household_id, planned_for)
);

create table public.meal_plan_exclusions (
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade,
  ingredient_id uuid not null references public.recipe_ingredients(id) on delete cascade,
  excluded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (meal_plan_id, ingredient_id)
);

create table public.recipe_ratings (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);

create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  quantity numeric check (quantity >= 0),
  unit text,
  department text not null,
  recipe_id uuid references public.recipes(id) on delete set null,
  meal_plan_id uuid references public.meal_plans(id) on delete cascade,
  is_checked boolean not null default false,
  added_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index recipes_household_id_idx on public.recipes(household_id);
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients(recipe_id);
create index meal_plans_household_date_idx on public.meal_plans(household_id, planned_for);
create index shopping_items_household_checked_idx on public.shopping_items(household_id, is_checked);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(new.email, '@', 1), ''),
      'Nieuw lid'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = target_household_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.can_access_recipe(target_recipe_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.recipes
    where id = target_recipe_id
      and (
        is_public
        or created_by = auth.uid()
        or (household_id is not null and public.is_household_member(household_id))
      )
  );
$$;

create or replace function public.is_household_owner(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = target_household_id
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function public.add_household_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.household_members (household_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger on_household_created
after insert on public.households
for each row execute procedure public.add_household_owner();

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_plan_exclusions enable row level security;
alter table public.recipe_ratings enable row level security;
alter table public.shopping_items enable row level security;

create policy "profiles are readable by signed-in users"
on public.profiles for select to authenticated using (true);

create policy "users manage their own profile"
on public.profiles for all to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy "members can read households"
on public.households for select to authenticated
using (public.is_household_member(id));

create policy "users can create households"
on public.households for insert to authenticated
with check (created_by = auth.uid());

create policy "owners can update households"
on public.households for update to authenticated
using (public.is_household_owner(id))
with check (public.is_household_owner(id));

create policy "owners can delete households"
on public.households for delete to authenticated
using (public.is_household_owner(id));

create policy "members can read memberships"
on public.household_members for select to authenticated
using (public.is_household_member(household_id));

create policy "owners manage memberships"
on public.household_members for all to authenticated
using (public.is_household_owner(household_id))
with check (public.is_household_owner(household_id));

create policy "accessible recipes are readable"
on public.recipes for select to authenticated
using (
  is_public
  or created_by = auth.uid()
  or (household_id is not null and public.is_household_member(household_id))
);

create policy "members can create recipes"
on public.recipes for insert to authenticated
with check (
  created_by = auth.uid()
  and (household_id is null or public.is_household_member(household_id))
);

create policy "creators can update recipes"
on public.recipes for update to authenticated
using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "creators can delete recipes"
on public.recipes for delete to authenticated using (created_by = auth.uid());

create policy "recipe ingredients follow recipe access"
on public.recipe_ingredients for select to authenticated
using (public.can_access_recipe(recipe_id));

create policy "recipe creators manage ingredients"
on public.recipe_ingredients for all to authenticated
using (
  exists (select 1 from public.recipes where id = recipe_id and created_by = auth.uid())
)
with check (
  exists (select 1 from public.recipes where id = recipe_id and created_by = auth.uid())
);

create policy "members can read meal plans"
on public.meal_plans for select to authenticated
using (public.is_household_member(household_id));

create policy "members can add meal plans"
on public.meal_plans for insert to authenticated
with check (public.is_household_member(household_id) and added_by = auth.uid());

create policy "members can update meal plans"
on public.meal_plans for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "members can delete meal plans"
on public.meal_plans for delete to authenticated
using (public.is_household_member(household_id));

create policy "members can read meal exclusions"
on public.meal_plan_exclusions for select to authenticated
using (
  exists (
    select 1 from public.meal_plans
    where id = meal_plan_id and public.is_household_member(household_id)
  )
);

create policy "members can add meal exclusions"
on public.meal_plan_exclusions for insert to authenticated
with check (
  excluded_by = auth.uid()
  and exists (
    select 1 from public.meal_plans
    where id = meal_plan_id and public.is_household_member(household_id)
  )
);

create policy "members can delete meal exclusions"
on public.meal_plan_exclusions for delete to authenticated
using (
  exists (
    select 1 from public.meal_plans
    where id = meal_plan_id and public.is_household_member(household_id)
  )
);

create policy "ratings follow recipe access"
on public.recipe_ratings for select to authenticated
using (public.can_access_recipe(recipe_id));

create policy "users manage their own ratings"
on public.recipe_ratings for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "members can read shopping items"
on public.shopping_items for select to authenticated
using (public.is_household_member(household_id));

create policy "members can add shopping items"
on public.shopping_items for insert to authenticated
with check (public.is_household_member(household_id) and added_by = auth.uid());

create policy "members can update shopping items"
on public.shopping_items for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "members can delete shopping items"
on public.shopping_items for delete to authenticated
using (public.is_household_member(household_id));
