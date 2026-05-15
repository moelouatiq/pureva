-- Pureva admin product management.
--
-- Run after database/admin-orders.sql so public.is_active_admin() and
-- public.set_updated_at() already exist.
--
-- Product mutations are intentionally routed through audited RPCs. There is no
-- direct insert/update/delete grant for authenticated users and no hard delete.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug_fr text unique not null,
  slug_en text unique not null,
  name_fr text not null,
  name_en text not null,
  short_description_fr text,
  short_description_en text,
  long_description_fr text,
  long_description_en text,
  category text not null check (category in ('oil', 'serum', 'lotion', 'mask', 'pack', 'powder')),
  price_cents integer check (price_cents is null or price_cents > 0),
  price_status text not null default 'placeholder' check (price_status in ('confirmed', 'placeholder')),
  compare_at_price_cents integer check (compare_at_price_cents is null or compare_at_price_cents > 0),
  currency text not null default 'EUR',
  size text,
  size_status text not null default 'placeholder' check (size_status in ('confirmed', 'placeholder')),
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  images jsonb not null default '[]'::jsonb,
  benefits_fr jsonb not null default '[]'::jsonb,
  benefits_en jsonb not null default '[]'::jsonb,
  ingredients_inci_fr text,
  ingredients_inci_en text,
  how_to_use_fr text,
  how_to_use_en text,
  precautions_fr text,
  precautions_en text,
  is_best_seller boolean not null default false,
  is_routine_product boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  seo_title_fr text,
  seo_title_en text,
  seo_description_fr text,
  seo_description_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  check (currency = 'EUR'),
  check (price_status <> 'confirmed' or price_cents is not null),
  check (
    compare_at_price_cents is null
    or price_status <> 'confirmed'
    or price_cents is null
    or compare_at_price_cents > price_cents
  ),
  check (jsonb_typeof(images) = 'array'),
  check (jsonb_typeof(benefits_fr) = 'array'),
  check (jsonb_typeof(benefits_en) = 'array')
);

create table if not exists public.admin_product_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  admin_user_id uuid null references auth.users(id),
  event_type text not null,
  before_snapshot jsonb,
  after_snapshot jsonb,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_sort_order_idx on public.products (sort_order, updated_at desc);
create index if not exists products_slug_fr_idx on public.products (slug_fr);
create index if not exists products_slug_en_idx on public.products (slug_en);
create index if not exists admin_product_events_product_id_idx
  on public.admin_product_events (product_id, created_at desc);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.admin_product_events enable row level security;

revoke all on public.products from anon;
revoke all on public.admin_product_events from anon;
revoke insert, update, delete on public.products from authenticated;
revoke insert, update, delete on public.admin_product_events from authenticated;

grant select on public.products to authenticated;
grant select on public.admin_product_events to authenticated;

drop policy if exists "active admins can read products" on public.products;
create policy "active admins can read products"
on public.products
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "active admins can read product events" on public.admin_product_events;
create policy "active admins can read product events"
on public.admin_product_events
for select
to authenticated
using (public.is_active_admin());

create or replace function public.product_from_payload(
  p_product public.products,
  p_payload jsonb,
  p_publish boolean default false
)
returns public.products
language plpgsql
set search_path = public
as $$
declare
  v_product public.products := p_product;
  v_status text;
begin
  v_status := coalesce(nullif(p_payload->>'status', ''), v_product.status, 'draft');

  v_product.legacy_id := nullif(p_payload->>'legacy_id', '');
  v_product.slug_fr := nullif(p_payload->>'slug_fr', '');
  v_product.slug_en := nullif(p_payload->>'slug_en', '');
  v_product.name_fr := nullif(p_payload->>'name_fr', '');
  v_product.name_en := nullif(p_payload->>'name_en', '');
  v_product.short_description_fr := nullif(p_payload->>'short_description_fr', '');
  v_product.short_description_en := nullif(p_payload->>'short_description_en', '');
  v_product.long_description_fr := nullif(p_payload->>'long_description_fr', '');
  v_product.long_description_en := nullif(p_payload->>'long_description_en', '');
  v_product.category := nullif(p_payload->>'category', '');
  v_product.price_cents := nullif(p_payload->>'price_cents', '')::integer;
  v_product.price_status := coalesce(nullif(p_payload->>'price_status', ''), 'placeholder');
  v_product.compare_at_price_cents := nullif(p_payload->>'compare_at_price_cents', '')::integer;
  v_product.currency := coalesce(nullif(p_payload->>'currency', ''), 'EUR');
  v_product.size := nullif(p_payload->>'size', '');
  v_product.size_status := coalesce(nullif(p_payload->>'size_status', ''), 'placeholder');
  v_product.stock_status := coalesce(nullif(p_payload->>'stock_status', ''), 'in_stock');
  v_product.images := coalesce(p_payload->'images', '[]'::jsonb);
  v_product.benefits_fr := coalesce(p_payload->'benefits_fr', '[]'::jsonb);
  v_product.benefits_en := coalesce(p_payload->'benefits_en', '[]'::jsonb);
  v_product.ingredients_inci_fr := nullif(p_payload->>'ingredients_inci_fr', '');
  v_product.ingredients_inci_en := nullif(p_payload->>'ingredients_inci_en', '');
  v_product.how_to_use_fr := nullif(p_payload->>'how_to_use_fr', '');
  v_product.how_to_use_en := nullif(p_payload->>'how_to_use_en', '');
  v_product.precautions_fr := nullif(p_payload->>'precautions_fr', '');
  v_product.precautions_en := nullif(p_payload->>'precautions_en', '');
  v_product.is_best_seller := coalesce((p_payload->>'is_best_seller')::boolean, false);
  v_product.is_routine_product := coalesce((p_payload->>'is_routine_product')::boolean, false);
  v_product.status := case when p_publish then 'published' else v_status end;
  v_product.sort_order := coalesce(nullif(p_payload->>'sort_order', '')::integer, 0);
  v_product.seo_title_fr := nullif(p_payload->>'seo_title_fr', '');
  v_product.seo_title_en := nullif(p_payload->>'seo_title_en', '');
  v_product.seo_description_fr := nullif(p_payload->>'seo_description_fr', '');
  v_product.seo_description_en := nullif(p_payload->>'seo_description_en', '');

  if v_product.status = 'published' and v_product.published_at is null then
    v_product.published_at := now();
  elsif v_product.status <> 'published' then
    v_product.published_at := null;
  end if;

  return v_product;
end;
$$;

create or replace function public.create_product_with_event(
  p_admin_user_id uuid,
  p_product jsonb,
  p_note text default null
)
returns public.products
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_product public.products;
begin
  if auth.uid() is null or auth.uid() <> p_admin_user_id or not public.is_active_admin() then
    raise exception 'not authorized';
  end if;

  v_product := public.product_from_payload(null::public.products, p_product, false);

  insert into public.products (
    legacy_id, slug_fr, slug_en, name_fr, name_en, short_description_fr, short_description_en,
    long_description_fr, long_description_en, category, price_cents, price_status,
    compare_at_price_cents, currency, size, size_status, stock_status, images,
    benefits_fr, benefits_en, ingredients_inci_fr, ingredients_inci_en, how_to_use_fr,
    how_to_use_en, precautions_fr, precautions_en, is_best_seller, is_routine_product,
    status, sort_order, seo_title_fr, seo_title_en, seo_description_fr,
    seo_description_en, published_at
  )
  values (
    v_product.legacy_id, v_product.slug_fr, v_product.slug_en, v_product.name_fr, v_product.name_en,
    v_product.short_description_fr, v_product.short_description_en, v_product.long_description_fr,
    v_product.long_description_en, v_product.category, v_product.price_cents,
    v_product.price_status, v_product.compare_at_price_cents, v_product.currency,
    v_product.size, v_product.size_status, v_product.stock_status, v_product.images,
    v_product.benefits_fr, v_product.benefits_en, v_product.ingredients_inci_fr,
    v_product.ingredients_inci_en, v_product.how_to_use_fr, v_product.how_to_use_en,
    v_product.precautions_fr, v_product.precautions_en, v_product.is_best_seller,
    v_product.is_routine_product, v_product.status, v_product.sort_order,
    v_product.seo_title_fr, v_product.seo_title_en, v_product.seo_description_fr,
    v_product.seo_description_en, v_product.published_at
  )
  returning * into v_product;

  insert into public.admin_product_events (product_id, admin_user_id, event_type, after_snapshot, note)
  values (v_product.id, p_admin_user_id, 'product_created', to_jsonb(v_product), nullif(trim(p_note), ''));

  return v_product;
end;
$$;

create or replace function public.update_product_with_event(
  p_product_id uuid,
  p_admin_user_id uuid,
  p_product jsonb,
  p_note text default null
)
returns public.products
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_before public.products;
  v_product public.products;
begin
  if auth.uid() is null or auth.uid() <> p_admin_user_id or not public.is_active_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_before from public.products where id = p_product_id for update;
  if not found then
    raise exception 'product not found';
  end if;

  v_product := public.product_from_payload(v_before, p_product, false);

  update public.products
  set
    legacy_id = v_product.legacy_id,
    slug_fr = v_product.slug_fr,
    slug_en = v_product.slug_en,
    name_fr = v_product.name_fr,
    name_en = v_product.name_en,
    short_description_fr = v_product.short_description_fr,
    short_description_en = v_product.short_description_en,
    long_description_fr = v_product.long_description_fr,
    long_description_en = v_product.long_description_en,
    category = v_product.category,
    price_cents = v_product.price_cents,
    price_status = v_product.price_status,
    compare_at_price_cents = v_product.compare_at_price_cents,
    currency = v_product.currency,
    size = v_product.size,
    size_status = v_product.size_status,
    stock_status = v_product.stock_status,
    images = v_product.images,
    benefits_fr = v_product.benefits_fr,
    benefits_en = v_product.benefits_en,
    ingredients_inci_fr = v_product.ingredients_inci_fr,
    ingredients_inci_en = v_product.ingredients_inci_en,
    how_to_use_fr = v_product.how_to_use_fr,
    how_to_use_en = v_product.how_to_use_en,
    precautions_fr = v_product.precautions_fr,
    precautions_en = v_product.precautions_en,
    is_best_seller = v_product.is_best_seller,
    is_routine_product = v_product.is_routine_product,
    status = v_product.status,
    sort_order = v_product.sort_order,
    seo_title_fr = v_product.seo_title_fr,
    seo_title_en = v_product.seo_title_en,
    seo_description_fr = v_product.seo_description_fr,
    seo_description_en = v_product.seo_description_en,
    published_at = v_product.published_at
  where id = p_product_id
  returning * into v_product;

  insert into public.admin_product_events (
    product_id, admin_user_id, event_type, before_snapshot, after_snapshot, note
  )
  values (
    p_product_id, p_admin_user_id, 'product_updated', to_jsonb(v_before), to_jsonb(v_product), nullif(trim(p_note), '')
  );

  return v_product;
end;
$$;

create or replace function public.publish_product_with_event(
  p_product_id uuid,
  p_admin_user_id uuid,
  p_note text default null
)
returns public.products
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_before public.products;
  v_product public.products;
begin
  if auth.uid() is null or auth.uid() <> p_admin_user_id or not public.is_active_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_before from public.products where id = p_product_id for update;
  if not found then
    raise exception 'product not found';
  end if;

  update public.products
  set status = 'published', published_at = coalesce(published_at, now())
  where id = p_product_id
  returning * into v_product;

  insert into public.admin_product_events (
    product_id, admin_user_id, event_type, before_snapshot, after_snapshot, note
  )
  values (
    p_product_id, p_admin_user_id, 'product_published', to_jsonb(v_before), to_jsonb(v_product), nullif(trim(p_note), '')
  );

  return v_product;
end;
$$;

create or replace function public.archive_product_with_event(
  p_product_id uuid,
  p_admin_user_id uuid,
  p_note text default null
)
returns public.products
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_before public.products;
  v_product public.products;
begin
  if auth.uid() is null or auth.uid() <> p_admin_user_id or not public.is_active_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_before from public.products where id = p_product_id for update;
  if not found then
    raise exception 'product not found';
  end if;

  update public.products
  set status = 'archived', published_at = null
  where id = p_product_id
  returning * into v_product;

  insert into public.admin_product_events (
    product_id, admin_user_id, event_type, before_snapshot, after_snapshot, note
  )
  values (
    p_product_id, p_admin_user_id, 'product_archived', to_jsonb(v_before), to_jsonb(v_product), nullif(trim(p_note), '')
  );

  return v_product;
end;
$$;

revoke all on function public.product_from_payload(public.products, jsonb, boolean) from public;
revoke all on function public.create_product_with_event(uuid, jsonb, text) from public;
revoke all on function public.update_product_with_event(uuid, uuid, jsonb, text) from public;
revoke all on function public.publish_product_with_event(uuid, uuid, text) from public;
revoke all on function public.archive_product_with_event(uuid, uuid, text) from public;

grant execute on function public.create_product_with_event(uuid, jsonb, text) to authenticated;
grant execute on function public.update_product_with_event(uuid, uuid, jsonb, text) to authenticated;
grant execute on function public.publish_product_with_event(uuid, uuid, text) to authenticated;
grant execute on function public.archive_product_with_event(uuid, uuid, text) to authenticated;
