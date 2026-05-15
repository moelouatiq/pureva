-- Pureva admin order soft delete migration.
--
-- Run this after database/admin-orders.sql has already been applied.
-- This migration is additive and preserves order rows and event history.

alter table public.orders
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by uuid null references auth.users(id),
  add column if not exists delete_reason text null;

create index if not exists orders_deleted_at_idx on public.orders (deleted_at);

revoke delete on public.orders from authenticated;
revoke update, delete on public.order_events from authenticated;

grant update (deleted_at, deleted_by, delete_reason, updated_at) on public.orders to authenticated;

create or replace function public.soft_delete_order_with_event(
  p_order_id uuid,
  p_admin_user_id uuid,
  p_note text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_order public.orders;
  v_note text;
begin
  if auth.uid() is null or auth.uid() <> p_admin_user_id then
    raise exception 'not authorized';
  end if;

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

  if v_order.deleted_at is not null then
    return v_order;
  end if;

  v_note := nullif(trim(coalesce(p_note, '')), '');

  update public.orders
  set
    deleted_at = now(),
    deleted_by = p_admin_user_id,
    delete_reason = v_note,
    updated_at = now()
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
    p_admin_user_id,
    'order_deleted',
    v_order.status,
    v_order.status,
    v_note
  );

  return v_order;
end;
$$;

revoke all on function public.soft_delete_order_with_event(uuid, uuid, text) from public;
revoke all on function public.soft_delete_order_with_event(uuid, uuid, text) from anon;
grant execute on function public.soft_delete_order_with_event(uuid, uuid, text) to authenticated;
