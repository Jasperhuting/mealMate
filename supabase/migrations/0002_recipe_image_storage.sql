insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recipe-images',
  'recipe-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "household members can view recipe images"
on storage.objects for select to authenticated
using (
  bucket_id = 'recipe-images'
  and public.is_household_member(((storage.foldername(name))[1])::uuid)
);

create policy "household members can add recipe images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'recipe-images'
  and public.is_household_member(((storage.foldername(name))[1])::uuid)
);

create policy "household members can update recipe images"
on storage.objects for update to authenticated
using (
  bucket_id = 'recipe-images'
  and public.is_household_member(((storage.foldername(name))[1])::uuid)
)
with check (
  bucket_id = 'recipe-images'
  and public.is_household_member(((storage.foldername(name))[1])::uuid)
);

create policy "household members can delete recipe images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'recipe-images'
  and public.is_household_member(((storage.foldername(name))[1])::uuid)
);
