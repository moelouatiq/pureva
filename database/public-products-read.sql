-- Public read access for the published product catalog.
--
-- Products with status = 'published' are public catalog content.
-- Draft and archived products remain hidden by RLS. This file does not add
-- any public write path and preserves the existing active-admin policies.

grant select on public.products to anon;
grant select on public.products to authenticated;

revoke insert, update, delete on public.products from anon;
revoke insert, update, delete on public.products from authenticated;

drop policy if exists "public can read published products" on public.products;
create policy "public can read published products"
on public.products
for select
to anon, authenticated
using (status = 'published');
