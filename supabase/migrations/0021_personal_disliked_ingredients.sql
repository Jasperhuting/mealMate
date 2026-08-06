create table public.user_disliked_ingredients (
  user_id uuid not null references public.profiles(id) on delete cascade,
  ingredient_name text not null check (
    char_length(ingredient_name) between 1 and 120
    and ingredient_name = lower(trim(ingredient_name))
  ),
  created_at timestamptz not null default now(),
  primary key (user_id, ingredient_name)
);

alter table public.user_disliked_ingredients enable row level security;

create policy "users can read their own disliked ingredients"
on public.user_disliked_ingredients for select to authenticated
using (user_id = auth.uid());

create policy "users can add their own disliked ingredients"
on public.user_disliked_ingredients for insert to authenticated
with check (user_id = auth.uid());

create policy "users can remove their own disliked ingredients"
on public.user_disliked_ingredients for delete to authenticated
using (user_id = auth.uid());

create or replace function public.set_user_disliked_ingredients(preference_names text[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from public.user_disliked_ingredients
  where user_id = auth.uid();

  insert into public.user_disliked_ingredients (user_id, ingredient_name)
  select auth.uid(), normalized_name
  from (
    select distinct lower(trim(name)) as normalized_name
    from unnest(coalesce(preference_names, array[]::text[])) as preference(name)
  ) as preferences
  where char_length(normalized_name) between 1 and 120;
end;
$$;

grant execute on function public.set_user_disliked_ingredients(text[]) to authenticated;
