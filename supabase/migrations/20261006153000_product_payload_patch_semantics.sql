-- Product saves use PATCH semantics.
--
-- Before: product_from_payload rebuilt every column from the payload, so any
-- key missing from the payload (stale admin UI, partial script) was silently
-- written as NULL / '[]'. That wiped image alts, usage area, texture, etc.
--
-- After:
--   * key absent from the payload      -> existing value is kept
--   * key present with an empty value  -> nullable columns are cleared,
--                                         required columns keep their value
--   * create (no existing row)         -> column defaults apply
--
-- create_product_with_event / update_product_with_event call this function
-- and need no change. Idempotent (create or replace).

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

  -- PATCH semantics: a key absent from the payload keeps the existing value
  -- (defaults apply on create). An explicit empty value only clears nullable
  -- columns; required columns keep their current value.
  if p_payload ? 'legacy_id' then v_product.legacy_id := nullif(p_payload->>'legacy_id', ''); end if;
  v_product.slug_fr := coalesce(nullif(p_payload->>'slug_fr', ''), v_product.slug_fr);
  v_product.slug_en := coalesce(nullif(p_payload->>'slug_en', ''), v_product.slug_en);
  v_product.name_fr := coalesce(nullif(p_payload->>'name_fr', ''), v_product.name_fr);
  v_product.name_en := coalesce(nullif(p_payload->>'name_en', ''), v_product.name_en);
  if p_payload ? 'short_description_fr' then v_product.short_description_fr := nullif(p_payload->>'short_description_fr', ''); end if;
  if p_payload ? 'short_description_en' then v_product.short_description_en := nullif(p_payload->>'short_description_en', ''); end if;
  if p_payload ? 'long_description_fr' then v_product.long_description_fr := nullif(p_payload->>'long_description_fr', ''); end if;
  if p_payload ? 'long_description_en' then v_product.long_description_en := nullif(p_payload->>'long_description_en', ''); end if;
  v_product.category := coalesce(nullif(p_payload->>'category', ''), v_product.category);
  if p_payload ? 'price_cents' then v_product.price_cents := nullif(p_payload->>'price_cents', '')::integer; end if;
  v_product.price_status := coalesce(nullif(p_payload->>'price_status', ''), v_product.price_status, 'placeholder');
  if p_payload ? 'compare_at_price_cents' then v_product.compare_at_price_cents := nullif(p_payload->>'compare_at_price_cents', '')::integer; end if;
  v_product.currency := coalesce(nullif(p_payload->>'currency', ''), v_product.currency, 'EUR');
  if p_payload ? 'size' then v_product.size := nullif(p_payload->>'size', ''); end if;
  v_product.size_status := coalesce(nullif(p_payload->>'size_status', ''), v_product.size_status, 'placeholder');
  v_product.stock_status := coalesce(nullif(p_payload->>'stock_status', ''), v_product.stock_status, 'in_stock');
  v_product.images := coalesce(nullif(p_payload->'images', 'null'::jsonb), v_product.images, '[]'::jsonb);
  v_product.image_alt_fr := coalesce(nullif(p_payload->'image_alt_fr', 'null'::jsonb), v_product.image_alt_fr, '[]'::jsonb);
  v_product.image_alt_en := coalesce(nullif(p_payload->'image_alt_en', 'null'::jsonb), v_product.image_alt_en, '[]'::jsonb);
  v_product.benefits_fr := coalesce(nullif(p_payload->'benefits_fr', 'null'::jsonb), v_product.benefits_fr, '[]'::jsonb);
  v_product.benefits_en := coalesce(nullif(p_payload->'benefits_en', 'null'::jsonb), v_product.benefits_en, '[]'::jsonb);
  v_product.key_ingredients_fr := coalesce(nullif(p_payload->'key_ingredients_fr', 'null'::jsonb), v_product.key_ingredients_fr, '[]'::jsonb);
  v_product.key_ingredients_en := coalesce(nullif(p_payload->'key_ingredients_en', 'null'::jsonb), v_product.key_ingredients_en, '[]'::jsonb);
  if p_payload ? 'composition_note_fr' then v_product.composition_note_fr := nullif(p_payload->>'composition_note_fr', ''); end if;
  if p_payload ? 'composition_note_en' then v_product.composition_note_en := nullif(p_payload->>'composition_note_en', ''); end if;
  if p_payload ? 'ingredients_inci_fr' then v_product.ingredients_inci_fr := nullif(p_payload->>'ingredients_inci_fr', ''); end if;
  if p_payload ? 'ingredients_inci_en' then v_product.ingredients_inci_en := nullif(p_payload->>'ingredients_inci_en', ''); end if;
  if p_payload ? 'how_to_use_fr' then v_product.how_to_use_fr := nullif(p_payload->>'how_to_use_fr', ''); end if;
  if p_payload ? 'how_to_use_en' then v_product.how_to_use_en := nullif(p_payload->>'how_to_use_en', ''); end if;
  if p_payload ? 'precautions_fr' then v_product.precautions_fr := nullif(p_payload->>'precautions_fr', ''); end if;
  if p_payload ? 'precautions_en' then v_product.precautions_en := nullif(p_payload->>'precautions_en', ''); end if;
  if p_payload ? 'target_audience_fr' then v_product.target_audience_fr := nullif(p_payload->>'target_audience_fr', ''); end if;
  if p_payload ? 'target_audience_en' then v_product.target_audience_en := nullif(p_payload->>'target_audience_en', ''); end if;
  if p_payload ? 'usage_area_fr' then v_product.usage_area_fr := nullif(p_payload->>'usage_area_fr', ''); end if;
  if p_payload ? 'usage_area_en' then v_product.usage_area_en := nullif(p_payload->>'usage_area_en', ''); end if;
  if p_payload ? 'texture_fr' then v_product.texture_fr := nullif(p_payload->>'texture_fr', ''); end if;
  if p_payload ? 'texture_en' then v_product.texture_en := nullif(p_payload->>'texture_en', ''); end if;
  if p_payload ? 'color_fr' then v_product.color_fr := nullif(p_payload->>'color_fr', ''); end if;
  if p_payload ? 'color_en' then v_product.color_en := nullif(p_payload->>'color_en', ''); end if;
  if p_payload ? 'fragrance_fr' then v_product.fragrance_fr := nullif(p_payload->>'fragrance_fr', ''); end if;
  if p_payload ? 'fragrance_en' then v_product.fragrance_en := nullif(p_payload->>'fragrance_en', ''); end if;
  if p_payload ? 'packaging_fr' then v_product.packaging_fr := nullif(p_payload->>'packaging_fr', ''); end if;
  if p_payload ? 'packaging_en' then v_product.packaging_en := nullif(p_payload->>'packaging_en', ''); end if;
  if p_payload ? 'storage_instructions_fr' then v_product.storage_instructions_fr := nullif(p_payload->>'storage_instructions_fr', ''); end if;
  if p_payload ? 'storage_instructions_en' then v_product.storage_instructions_en := nullif(p_payload->>'storage_instructions_en', ''); end if;
  v_product.is_best_seller := coalesce((p_payload->>'is_best_seller')::boolean, v_product.is_best_seller, false);
  v_product.is_routine_product := coalesce((p_payload->>'is_routine_product')::boolean, v_product.is_routine_product, false);
  v_product.show_on_homepage := coalesce((p_payload->>'show_on_homepage')::boolean, v_product.show_on_homepage, false);
  v_product.show_in_shop := coalesce((p_payload->>'show_in_shop')::boolean, v_product.show_in_shop, true);
  if p_payload ? 'homepage_order' then v_product.homepage_order := nullif(p_payload->>'homepage_order', '')::integer; end if;
  if p_payload ? 'shop_order' then v_product.shop_order := nullif(p_payload->>'shop_order', '')::integer; end if;
  if p_payload ? 'routine_order' then v_product.routine_order := nullif(p_payload->>'routine_order', '')::integer; end if;
  if p_payload ? 'routine_step' then v_product.routine_step := nullif(p_payload->>'routine_step', ''); end if;
  v_product.status := case when p_publish then 'published' else v_status end;
  v_product.sort_order := coalesce(nullif(p_payload->>'sort_order', '')::integer, v_product.sort_order, 0);
  if p_payload ? 'seo_title_fr' then v_product.seo_title_fr := nullif(p_payload->>'seo_title_fr', ''); end if;
  if p_payload ? 'seo_title_en' then v_product.seo_title_en := nullif(p_payload->>'seo_title_en', ''); end if;
  if p_payload ? 'seo_description_fr' then v_product.seo_description_fr := nullif(p_payload->>'seo_description_fr', ''); end if;
  if p_payload ? 'seo_description_en' then v_product.seo_description_en := nullif(p_payload->>'seo_description_en', ''); end if;

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

revoke all on function public.product_from_payload(public.products, jsonb, boolean) from public;
