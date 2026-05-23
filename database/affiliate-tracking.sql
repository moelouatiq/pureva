-- Pureva affiliate / influencer tracking setup.
--
-- Run this after database/admin-orders.sql has already been applied.
-- This migration is additive and keeps order creation atomic through
-- create_order_with_event.

create extension if not exists pgcrypto;

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  email text null,
  phone text null,
  instagram_handle text null,
  commission_type text not null default 'percentage',
  commission_value numeric(10,2) not null default 10,
  status text not null default 'active',
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliates_commission_type_check check (commission_type in ('percentage', 'fixed')),
  constraint affiliates_status_check check (status in ('active', 'inactive')),
  constraint affiliates_code_format_check check (code ~ '^[a-z0-9][a-z0-9_-]{1,63}$'),
  constraint affiliates_commission_value_check check (commission_value >= 0)
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete set null,
  affiliate_code text not null,
  landing_path text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_content text null,
  utm_term text null,
  referrer text null,
  user_agent text null,
  ip_hash text null,
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists affiliate_id uuid null references public.affiliates(id) on delete set null,
  add column if not exists affiliate_code text null,
  add column if not exists utm_source text null,
  add column if not exists utm_medium text null,
  add column if not exists utm_campaign text null,
  add column if not exists utm_content text null,
  add column if not exists utm_term text null,
  add column if not exists landing_path text null,
  add column if not exists attribution_source text null,
  add column if not exists commission_status text not null default 'none',
  add column if not exists commission_amount_cents integer null,
  add column if not exists commission_currency text not null default 'EUR';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_commission_status_check'
  ) then
    alter table public.orders
      add constraint orders_commission_status_check
      check (commission_status in ('none', 'pending', 'approved', 'rejected', 'paid'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_commission_amount_check'
  ) then
    alter table public.orders
      add constraint orders_commission_amount_check
      check (commission_amount_cents is null or commission_amount_cents >= 0);
  end if;
end;
$$;

create index if not exists affiliates_code_idx on public.affiliates (code);
create index if not exists affiliates_status_idx on public.affiliates (status);
create index if not exists affiliate_clicks_affiliate_id_created_at_idx
  on public.affiliate_clicks (affiliate_id, created_at desc);
create index if not exists affiliate_clicks_affiliate_code_created_at_idx
  on public.affiliate_clicks (affiliate_code, created_at desc);
create index if not exists orders_affiliate_id_created_at_idx
  on public.orders (affiliate_id, created_at desc);
create index if not exists orders_commission_status_idx
  on public.orders (commission_status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists affiliates_set_updated_at on public.affiliates;
create trigger affiliates_set_updated_at
before update on public.affiliates
for each row
execute function public.set_updated_at();

create or replace function public.guard_order_commission_status_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.commission_status is distinct from new.commission_status
    and current_setting('app.commission_status_rpc', true) <> 'on' then
    raise exception 'commission status updates must use update_order_commission_status_with_event';
  end if;

  return new;
end;
$$;

drop trigger if exists orders_guard_commission_status_update on public.orders;
create trigger orders_guard_commission_status_update
before update of commission_status on public.orders
for each row
execute function public.guard_order_commission_status_update();

alter table public.affiliates enable row level security;
alter table public.affiliate_clicks enable row level security;

revoke all on public.affiliates from anon;
revoke all on public.affiliate_clicks from anon;
revoke all on public.affiliates from authenticated;
revoke all on public.affiliate_clicks from authenticated;

grant select, insert, update on public.affiliates to authenticated;
grant select on public.affiliate_clicks to authenticated;

drop policy if exists "active admins can read affiliates" on public.affiliates;
create policy "active admins can read affiliates"
on public.affiliates
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "active admins can insert affiliates" on public.affiliates;
create policy "active admins can insert affiliates"
on public.affiliates
for insert
to authenticated
with check (public.is_active_admin());

drop policy if exists "active admins can update affiliates" on public.affiliates;
create policy "active admins can update affiliates"
on public.affiliates
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "active admins can read affiliate clicks" on public.affiliate_clicks;
create policy "active admins can read affiliate clicks"
on public.affiliate_clicks
for select
to authenticated
using (public.is_active_admin());

drop function if exists public.create_order_with_event(
  text, text, text, text, text, text, text, text, text, text,
  integer, integer, integer, text, text, text, text
);

create or replace function public.create_order_with_event(
  p_order_reference text,
  p_locale text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_country text,
  p_customer_address text,
  p_product_id text,
  p_product_name text,
  p_product_slug text,
  p_quantity integer,
  p_unit_price_cents integer,
  p_subtotal_cents integer,
  p_price_status text,
  p_currency text,
  p_customer_message text,
  p_source text default 'website',
  p_affiliate_id uuid default null,
  p_affiliate_code text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_utm_term text default null,
  p_landing_path text default null,
  p_attribution_source text default null,
  p_commission_status text default 'none',
  p_commission_amount_cents integer default null,
  p_commission_currency text default 'EUR'
)
returns public.orders
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_order public.orders;
  v_commission_status text;
begin
  v_commission_status := coalesce(p_commission_status, 'none');

  if v_commission_status not in ('none', 'pending', 'approved', 'rejected', 'paid') then
    raise exception 'invalid commission status';
  end if;

  if v_commission_status <> 'none' and p_commission_amount_cents is null then
    raise exception 'commission amount required when commission status is not none';
  end if;

  insert into public.orders (
    order_reference,
    locale,
    customer_name,
    customer_email,
    customer_phone,
    customer_country,
    customer_address,
    product_id,
    product_name,
    product_slug,
    quantity,
    unit_price_cents,
    subtotal_cents,
    price_status,
    currency,
    customer_message,
    source,
    affiliate_id,
    affiliate_code,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    landing_path,
    attribution_source,
    commission_status,
    commission_amount_cents,
    commission_currency
  )
  values (
    p_order_reference,
    p_locale,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_customer_country,
    p_customer_address,
    p_product_id,
    p_product_name,
    p_product_slug,
    p_quantity,
    p_unit_price_cents,
    p_subtotal_cents,
    p_price_status,
    p_currency,
    p_customer_message,
    p_source,
    p_affiliate_id,
    p_affiliate_code,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_utm_content,
    p_utm_term,
    p_landing_path,
    p_attribution_source,
    v_commission_status,
    p_commission_amount_cents,
    coalesce(p_commission_currency, 'EUR')
  )
  returning * into v_order;

  insert into public.order_events (order_id, event_type, new_status, note)
  values (v_order.id, 'order_created', v_order.status, 'Order submitted from website');

  return v_order;
end;
$$;

create or replace function public.update_order_commission_status_with_event(
  p_order_id uuid,
  p_new_status text,
  p_note text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_order public.orders;
  v_old_status text;
  v_note text;
begin
  if not public.is_active_admin() then
    raise exception 'not authorized';
  end if;

  if p_new_status not in ('approved', 'rejected', 'paid') then
    raise exception 'invalid commission status';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order not found';
  end if;

  v_old_status := v_order.commission_status;

  if not (
    (v_old_status = 'pending' and p_new_status in ('approved', 'rejected'))
    or (v_old_status = 'approved' and p_new_status = 'paid')
  ) then
    raise exception 'unsafe commission status transition';
  end if;

  perform set_config('app.commission_status_rpc', 'on', true);

  update public.orders
  set
    commission_status = p_new_status,
    updated_at = now()
  where id = p_order_id
  returning * into v_order;

  v_note := coalesce(
    nullif(trim(p_note), ''),
    'Commission status changed from ' || v_old_status || ' to ' || p_new_status
  );

  insert into public.order_events (
    order_id,
    admin_user_id,
    event_type,
    old_status,
    new_status,
    note
  )
  values (
    p_order_id,
    auth.uid(),
    'commission_status_changed',
    v_old_status,
    p_new_status,
    v_note
  );

  return v_order;
end;
$$;

revoke all on function public.create_order_with_event(
  text, text, text, text, text, text, text, text, text, text,
  integer, integer, integer, text, text, text, text,
  uuid, text, text, text, text, text, text, text, text, text, integer, text
) from public;
revoke all on function public.update_order_commission_status_with_event(uuid, text, text) from public;

grant execute on function public.create_order_with_event(
  text, text, text, text, text, text, text, text, text, text,
  integer, integer, integer, text, text, text, text,
  uuid, text, text, text, text, text, text, text, text, text, integer, text
) to service_role;
grant execute on function public.update_order_commission_status_with_event(uuid, text, text) to authenticated;
