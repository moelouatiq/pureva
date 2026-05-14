-- Pureva admin order management setup.
--
-- Setup notes:
-- 1. Run this SQL in the Supabase SQL editor.
-- 2. Manually create each admin user in Supabase Auth. Do not enable public signup.
-- 3. For each admin user, insert a matching profile:
--
--    insert into public.admin_profiles (auth_user_id, email, role, is_active)
--    values ('AUTH_USER_UUID_HERE', 'admin@example.com', 'admin', true);
--
-- 4. The same email must be listed in the server-only ADMIN_ALLOWED_EMAILS env var.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text unique not null,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_country text not null,
  customer_address text not null,
  product_id text not null,
  product_name text not null,
  product_slug text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer,
  subtotal_cents integer,
  price_status text not null default 'confirmed' check (price_status in ('confirmed', 'placeholder')),
  currency text not null default 'EUR',
  customer_message text,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')
  ),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  admin_user_id uuid null references auth.users(id),
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_customer_email_idx on public.orders (lower(customer_email));
create index if not exists orders_reference_idx on public.orders (order_reference);
create index if not exists order_events_order_id_idx on public.order_events (order_id, created_at desc);

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

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create or replace function public.guard_order_status_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.status is distinct from new.status
    and current_setting('app.order_status_rpc', true) <> 'on' then
    raise exception 'order status updates must use update_order_status_with_event';
  end if;

  return new;
end;
$$;

drop trigger if exists orders_guard_status_update on public.orders;
create trigger orders_guard_status_update
before update of status on public.orders
for each row
execute function public.guard_order_status_update();

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.auth_user_id = auth.uid()
      and ap.is_active = true
  );
$$;

alter table public.admin_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;

revoke all on public.admin_profiles from anon;
revoke all on public.orders from anon;
revoke all on public.order_events from anon;

revoke insert, update, delete on public.admin_profiles from authenticated;
revoke insert, update, delete on public.orders from authenticated;
revoke update on public.orders from authenticated;
revoke update, delete on public.order_events from authenticated;

grant select on public.admin_profiles to authenticated;
grant select on public.orders to authenticated;
grant update (status, updated_at) on public.orders to authenticated;
grant select, insert on public.order_events to authenticated;

drop policy if exists "admins can read own profile" on public.admin_profiles;
create policy "admins can read own profile"
on public.admin_profiles
for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists "active admins can read orders" on public.orders;
create policy "active admins can read orders"
on public.orders
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "active admins can update order status fields" on public.orders;
create policy "active admins can update order status fields"
on public.orders
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "active admins can read order events" on public.order_events;
create policy "active admins can read order events"
on public.order_events
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "active admins can insert order events" on public.order_events;
create policy "active admins can insert order events"
on public.order_events
for insert
to authenticated
with check (public.is_active_admin());

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
  p_source text default 'website'
)
returns public.orders
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_order public.orders;
begin
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
    source
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
    p_source
  )
  returning * into v_order;

  insert into public.order_events (order_id, event_type, new_status, note)
  values (v_order.id, 'order_created', v_order.status, 'Order submitted from website');

  return v_order;
end;
$$;

create or replace function public.update_order_status_with_event(
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
begin
  if not public.is_active_admin() then
    raise exception 'not authorized';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order not found';
  end if;

  v_old_status := v_order.status;

  perform set_config('app.order_status_rpc', 'on', true);

  update public.orders
  set status = p_new_status
  where id = p_order_id
  returning * into v_order;

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
    'status_changed',
    v_old_status,
    p_new_status,
    nullif(trim(p_note), '')
  );

  return v_order;
end;
$$;

revoke all on function public.is_active_admin() from public;
revoke all on function public.create_order_with_event(
  text, text, text, text, text, text, text, text, text, text, integer, integer, integer, text, text, text, text
) from public;
revoke all on function public.update_order_status_with_event(uuid, text, text) from public;

grant execute on function public.is_active_admin() to authenticated;
grant execute on function public.create_order_with_event(
  text, text, text, text, text, text, text, text, text, text, integer, integer, integer, text, text, text, text
) to service_role;
grant execute on function public.update_order_status_with_event(uuid, text, text) to authenticated;
