-- Admin-managed product visibility: homepage, shop, routine, best seller, ordering.
--
-- Idempotent and safe on existing data:
--   * is_best_seller is reused as-is.
--   * is_routine_product is reused as the "show in routine" flag.
--   * New columns are only backfilled the first time they are created, so
--     re-running this migration never overwrites choices made in the admin.
--   * Public visibility still requires status = 'published' (RLS policy
--     "public can read published products" is unchanged).

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'show_on_homepage'
  ) then
    alter table public.products add column show_on_homepage boolean not null default false;

    -- Preserve the current homepage slider: the first 5 published products.
    update public.products p
    set show_on_homepage = true
    from (
      select id from public.products
      where status = 'published'
      order by sort_order asc, created_at asc
      limit 5
    ) current_homepage
    where p.id = current_homepage.id;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'homepage_order'
  ) then
    alter table public.products add column homepage_order integer;
    update public.products set homepage_order = sort_order where show_on_homepage;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'routine_order'
  ) then
    alter table public.products add column routine_order integer;
    update public.products set routine_order = sort_order where is_routine_product and category <> 'pack';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'routine_step'
  ) then
    alter table public.products add column routine_step text;
    update public.products
    set routine_step = case category
      when 'oil' then 'oil'
      when 'serum' then 'serum'
      when 'mask' then 'mask'
      when 'lotion' then 'treatment'
      else 'other'
    end
    where is_routine_product and category <> 'pack';
  end if;
end;
$$;

-- Every existing product stays in the shop by default.
alter table public.products
  add column if not exists show_in_shop boolean not null default true,
  add column if not exists shop_order integer;

alter table public.products drop constraint if exists products_routine_step_check;
alter table public.products
  add constraint products_routine_step_check check (
    routine_step is null
    or routine_step in ('shampoo', 'treatment', 'mask', 'serum', 'oil', 'spray', 'finishing', 'other')
  );

create index if not exists products_public_visibility_idx
  on public.products (status, show_in_shop, show_on_homepage, is_routine_product);

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
  v_product.image_alt_fr := coalesce(p_payload->'image_alt_fr', '[]'::jsonb);
  v_product.image_alt_en := coalesce(p_payload->'image_alt_en', '[]'::jsonb);
  v_product.benefits_fr := coalesce(p_payload->'benefits_fr', '[]'::jsonb);
  v_product.benefits_en := coalesce(p_payload->'benefits_en', '[]'::jsonb);
  v_product.key_ingredients_fr := coalesce(p_payload->'key_ingredients_fr', '[]'::jsonb);
  v_product.key_ingredients_en := coalesce(p_payload->'key_ingredients_en', '[]'::jsonb);
  v_product.composition_note_fr := nullif(p_payload->>'composition_note_fr', '');
  v_product.composition_note_en := nullif(p_payload->>'composition_note_en', '');
  v_product.ingredients_inci_fr := nullif(p_payload->>'ingredients_inci_fr', '');
  v_product.ingredients_inci_en := nullif(p_payload->>'ingredients_inci_en', '');
  v_product.how_to_use_fr := nullif(p_payload->>'how_to_use_fr', '');
  v_product.how_to_use_en := nullif(p_payload->>'how_to_use_en', '');
  v_product.precautions_fr := nullif(p_payload->>'precautions_fr', '');
  v_product.precautions_en := nullif(p_payload->>'precautions_en', '');
  v_product.target_audience_fr := nullif(p_payload->>'target_audience_fr', '');
  v_product.target_audience_en := nullif(p_payload->>'target_audience_en', '');
  v_product.usage_area_fr := nullif(p_payload->>'usage_area_fr', '');
  v_product.usage_area_en := nullif(p_payload->>'usage_area_en', '');
  v_product.texture_fr := nullif(p_payload->>'texture_fr', '');
  v_product.texture_en := nullif(p_payload->>'texture_en', '');
  v_product.color_fr := nullif(p_payload->>'color_fr', '');
  v_product.color_en := nullif(p_payload->>'color_en', '');
  v_product.fragrance_fr := nullif(p_payload->>'fragrance_fr', '');
  v_product.fragrance_en := nullif(p_payload->>'fragrance_en', '');
  v_product.packaging_fr := nullif(p_payload->>'packaging_fr', '');
  v_product.packaging_en := nullif(p_payload->>'packaging_en', '');
  v_product.storage_instructions_fr := nullif(p_payload->>'storage_instructions_fr', '');
  v_product.storage_instructions_en := nullif(p_payload->>'storage_instructions_en', '');
  v_product.is_best_seller := coalesce((p_payload->>'is_best_seller')::boolean, false);
  v_product.is_routine_product := coalesce((p_payload->>'is_routine_product')::boolean, false);
  v_product.show_on_homepage := coalesce((p_payload->>'show_on_homepage')::boolean, false);
  v_product.show_in_shop := coalesce((p_payload->>'show_in_shop')::boolean, true);
  v_product.homepage_order := nullif(p_payload->>'homepage_order', '')::integer;
  v_product.shop_order := nullif(p_payload->>'shop_order', '')::integer;
  v_product.routine_order := nullif(p_payload->>'routine_order', '')::integer;
  v_product.routine_step := nullif(p_payload->>'routine_step', '');
  v_product.status := case when p_publish then 'published' else v_status end;
  v_product.sort_order := coalesce(nullif(p_payload->>'sort_order', '')::integer, 0);
  v_product.seo_title_fr := nullif(p_payload->>'seo_title_fr', '');
  v_product.seo_title_en := nullif(p_payload->>'seo_title_en', '');
  v_product.seo_description_fr := nullif(p_payload->>'seo_description_fr', '');
  v_product.seo_description_en := nullif(p_payload->>'seo_description_en', '');

  if v_product.status = 'published' and (
    v_product.price_status <> 'confirmed'
    or v_product.price_cents is null
    or v_product.price_cents <= 0
  ) then
    raise exception 'published products require a confirmed positive price';
  end if;

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
    image_alt_fr, image_alt_en, benefits_fr, benefits_en, key_ingredients_fr,
    key_ingredients_en, composition_note_fr, composition_note_en, ingredients_inci_fr,
    ingredients_inci_en, how_to_use_fr, how_to_use_en, precautions_fr, precautions_en,
    target_audience_fr, target_audience_en, usage_area_fr, usage_area_en, texture_fr,
    texture_en, color_fr, color_en, fragrance_fr, fragrance_en, packaging_fr,
    packaging_en, storage_instructions_fr, storage_instructions_en, is_best_seller, is_routine_product,
    show_on_homepage, show_in_shop, homepage_order, shop_order, routine_order, routine_step,
    status, sort_order, seo_title_fr, seo_title_en, seo_description_fr,
    seo_description_en, published_at
  )
  values (
    v_product.legacy_id, v_product.slug_fr, v_product.slug_en, v_product.name_fr, v_product.name_en,
    v_product.short_description_fr, v_product.short_description_en, v_product.long_description_fr,
    v_product.long_description_en, v_product.category, v_product.price_cents,
    v_product.price_status, v_product.compare_at_price_cents, v_product.currency,
    v_product.size, v_product.size_status, v_product.stock_status, v_product.images,
    v_product.image_alt_fr, v_product.image_alt_en, v_product.benefits_fr, v_product.benefits_en,
    v_product.key_ingredients_fr, v_product.key_ingredients_en, v_product.composition_note_fr,
    v_product.composition_note_en, v_product.ingredients_inci_fr, v_product.ingredients_inci_en,
    v_product.how_to_use_fr, v_product.how_to_use_en, v_product.precautions_fr,
    v_product.precautions_en, v_product.target_audience_fr, v_product.target_audience_en,
    v_product.usage_area_fr, v_product.usage_area_en, v_product.texture_fr, v_product.texture_en,
    v_product.color_fr, v_product.color_en, v_product.fragrance_fr, v_product.fragrance_en,
    v_product.packaging_fr, v_product.packaging_en, v_product.storage_instructions_fr,
    v_product.storage_instructions_en, v_product.is_best_seller,
    v_product.is_routine_product, v_product.show_on_homepage, v_product.show_in_shop,
    v_product.homepage_order, v_product.shop_order, v_product.routine_order, v_product.routine_step,
    v_product.status, v_product.sort_order,
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
    image_alt_fr = v_product.image_alt_fr,
    image_alt_en = v_product.image_alt_en,
    benefits_fr = v_product.benefits_fr,
    benefits_en = v_product.benefits_en,
    key_ingredients_fr = v_product.key_ingredients_fr,
    key_ingredients_en = v_product.key_ingredients_en,
    composition_note_fr = v_product.composition_note_fr,
    composition_note_en = v_product.composition_note_en,
    ingredients_inci_fr = v_product.ingredients_inci_fr,
    ingredients_inci_en = v_product.ingredients_inci_en,
    how_to_use_fr = v_product.how_to_use_fr,
    how_to_use_en = v_product.how_to_use_en,
    precautions_fr = v_product.precautions_fr,
    precautions_en = v_product.precautions_en,
    target_audience_fr = v_product.target_audience_fr,
    target_audience_en = v_product.target_audience_en,
    usage_area_fr = v_product.usage_area_fr,
    usage_area_en = v_product.usage_area_en,
    texture_fr = v_product.texture_fr,
    texture_en = v_product.texture_en,
    color_fr = v_product.color_fr,
    color_en = v_product.color_en,
    fragrance_fr = v_product.fragrance_fr,
    fragrance_en = v_product.fragrance_en,
    packaging_fr = v_product.packaging_fr,
    packaging_en = v_product.packaging_en,
    storage_instructions_fr = v_product.storage_instructions_fr,
    storage_instructions_en = v_product.storage_instructions_en,
    is_best_seller = v_product.is_best_seller,
    is_routine_product = v_product.is_routine_product,
    show_on_homepage = v_product.show_on_homepage,
    show_in_shop = v_product.show_in_shop,
    homepage_order = v_product.homepage_order,
    shop_order = v_product.shop_order,
    routine_order = v_product.routine_order,
    routine_step = v_product.routine_step,
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

revoke all on function public.product_from_payload(public.products, jsonb, boolean) from public;
revoke all on function public.create_product_with_event(uuid, jsonb, text) from public;
revoke all on function public.update_product_with_event(uuid, uuid, jsonb, text) from public;

grant execute on function public.create_product_with_event(uuid, jsonb, text) to authenticated;
grant execute on function public.update_product_with_event(uuid, uuid, jsonb, text) to authenticated;
