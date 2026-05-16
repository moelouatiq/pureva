-- Pureva product image storage.
--
-- Run this in the Supabase SQL editor after database/admin-orders.sql so
-- public.is_active_admin() exists. This file is idempotent and safe to run
-- more than once.
--
-- Product images are public catalog assets, but object writes stay restricted
-- to authenticated active admins.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;

drop policy if exists "public can read product images" on storage.objects;
create policy "public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "active admins can upload product images" on storage.objects;
create policy "active admins can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_active_admin()
);

drop policy if exists "active admins can update product images" on storage.objects;
create policy "active admins can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_active_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_active_admin()
);

drop policy if exists "active admins can delete product images" on storage.objects;
create policy "active admins can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_active_admin()
);

drop policy if exists "active admins can list product images" on storage.objects;
create policy "active admins can list product images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_active_admin()
);
