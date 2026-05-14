import 'server-only'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { orderListFilterSchema } from '@/lib/admin/schemas'
import type { AdminOrder, OrderEvent, OrderStatus } from '@/types/admin-order'

type ListOrdersInput = {
  status?: string
  search?: string
}

export type OrderDetail = {
  order: AdminOrder
  events: OrderEvent[]
}

function sanitizeSearch(value: string): string {
  return value.replace(/[%_,]/g, '').trim()
}

export async function listAdminOrders(input: ListOrdersInput): Promise<AdminOrder[]> {
  const parsed = orderListFilterSchema.safeParse({
    status: input.status || undefined,
    search: input.search || undefined,
  })

  const filters = parsed.success ? parsed.data : {}
  const supabase = await createSupabaseServerClient()
  if (!supabase) return []

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.search) {
    const search = sanitizeSearch(filters.search)
    if (search) {
      const pattern = `%${search}%`
      query = query.or(
        `order_reference.ilike.${pattern},customer_email.ilike.${pattern},customer_name.ilike.${pattern}`
      )
    }
  }

  const { data, error } = await query
  if (error || !data) return []

  return data as AdminOrder[]
}

export async function getAdminOrderDetail(id: string): Promise<OrderDetail | null> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (orderError || !order) return null

  const { data: events, error: eventsError } = await supabase
    .from('order_events')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false })

  if (eventsError || !events) return null

  return {
    order: order as AdminOrder,
    events: events as OrderEvent[],
  }
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { error } = await supabase.rpc('update_order_status_with_event', {
    p_order_id: orderId,
    p_new_status: status,
    p_note: note || null,
  })

  if (error) {
    return { success: false, error: 'update_failed' }
  }

  return { success: true }
}
