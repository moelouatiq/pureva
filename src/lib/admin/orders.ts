import 'server-only'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { orderListFilterSchema } from '@/lib/admin/schemas'
import type { AdminOrder, CommissionStatus, OrderEvent, OrderStatus } from '@/types/admin-order'

type ListOrdersInput = {
  status?: string
  search?: string
  showDeleted?: boolean
}

export type OrderDetail = {
  order: AdminOrder
  events: OrderEvent[]
  affiliate: { id: string; code: string; name: string } | null
}

function sanitizeSearch(value: string): string {
  return value.replace(/[%_,]/g, '').trim()
}

function isMissingSoftDeleteColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return error.code === '42703' || error.message?.includes('deleted_at') === true
}

function isMissingRpc(error: { code?: string; message?: string } | null): boolean {
  return error?.code === 'PGRST202' || error?.code === '42883'
}

export async function listAdminOrders(input: ListOrdersInput): Promise<AdminOrder[]> {
  const parsed = orderListFilterSchema.safeParse({
    status: input.status || undefined,
    search: input.search || undefined,
    showDeleted: input.showDeleted,
  })

  const filters = parsed.success ? parsed.data : {}
  const supabase = await createSupabaseServerClient()
  if (!supabase) return []

  const buildQuery = (filterDeleted: boolean) => {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!filters.showDeleted && filterDeleted) {
      query = query.is('deleted_at', null)
    }

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

    return query
  }

  let { data, error } = await buildQuery(true)
  if (isMissingSoftDeleteColumn(error)) {
    const fallback = await buildQuery(false)
    data = fallback.data
    error = fallback.error
  }

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

  let affiliate: { id: string; code: string; name: string } | null = null
  const affiliateId = (order as AdminOrder).affiliate_id

  if (affiliateId) {
    const { data: affiliateData } = await supabase
      .from('affiliates')
      .select('id, code, name')
      .eq('id', affiliateId)
      .maybeSingle()

    if (affiliateData) {
      affiliate = {
        id: String(affiliateData.id),
        code: String(affiliateData.code),
        name: String(affiliateData.name),
      }
    }
  }

  return {
    order: order as AdminOrder,
    events: events as OrderEvent[],
    affiliate,
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

export async function deleteAdminOrder(
  orderId: string,
  adminUserId: string,
  note?: string
): Promise<{ success: boolean; error?: 'not_configured' | 'delete_failed' | 'setup_required' }> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { error } = await supabase.rpc('soft_delete_order_with_event', {
    p_order_id: orderId,
    p_admin_user_id: adminUserId,
    p_note: note || null,
  })

  if (error) {
    if (error.code === 'PGRST202' || error.code === '42883') {
      return { success: false, error: 'not_configured' }
    }

    return { success: false, error: 'delete_failed' }
  }

  return { success: true }
}

export async function updateAdminOrderCommissionStatus(
  orderId: string,
  status: Extract<CommissionStatus, 'approved' | 'rejected' | 'paid'>,
  note?: string
): Promise<{ success: boolean; error?: 'setup_required' | 'not_configured' | 'update_failed' }> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { error } = await supabase.rpc('update_order_commission_status_with_event', {
    p_order_id: orderId,
    p_new_status: status,
    p_note: note || null,
  })

  if (error) {
    return { success: false, error: isMissingRpc(error) ? 'not_configured' : 'update_failed' }
  }

  return { success: true }
}
