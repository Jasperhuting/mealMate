revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.add_household_owner() from public, anon, authenticated;

revoke execute on function public.is_household_member(uuid) from public, anon, authenticated;
revoke execute on function public.is_household_owner(uuid) from public, anon, authenticated;
revoke execute on function public.can_access_recipe(uuid) from public, anon, authenticated;
grant execute on function public.is_household_member(uuid) to authenticated;
grant execute on function public.is_household_owner(uuid) to authenticated;
grant execute on function public.can_access_recipe(uuid) to authenticated;

revoke execute on function public.ensure_current_user_household() from public, anon, authenticated;
grant execute on function public.ensure_current_user_household() to authenticated;
