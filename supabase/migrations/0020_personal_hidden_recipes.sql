create table public.user_hidden_recipes (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);

create index user_hidden_recipes_user_id_idx
on public.user_hidden_recipes (user_id);

alter table public.user_hidden_recipes enable row level security;

create policy "users can read their own hidden recipes"
on public.user_hidden_recipes for select to authenticated
using (user_id = auth.uid());

create policy "users can hide accessible recipes"
on public.user_hidden_recipes for insert to authenticated
with check (
  user_id = auth.uid()
  and public.can_access_recipe(recipe_id)
);

create policy "users can update their own hidden recipes"
on public.user_hidden_recipes for update to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and public.can_access_recipe(recipe_id)
);

create policy "users can unhide their own recipes"
on public.user_hidden_recipes for delete to authenticated
using (user_id = auth.uid());
