import 'server-only'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  affiliateListFilterSchema,
  type AdminAffiliateInput,
} from '@/lib/admin/affiliate-schemas'
import type { AdminAffiliate, AdminAffiliateClick, AffiliateStatus } from '@/types/admin-affiliate'
import type { AdminOrder } from '@/types/admin-order'

export type AffiliateCommissionTotals = {
  pending: number
  approved: number
  paid: number
}

export type AdminAffiliateListItem = AdminAffiliate & {
  clickCount: number
  orderCount: number
  commissionTotals: AffiliateCommissionTotals
}

export type AdminAffiliateDetail = {
  affiliate: AdminAffiliate
  clicks: AdminAffiliateClick[]
  orders: AdminOrder[]
  clickCount: number
  orderCount: number
  commissionTotals: AffiliateCommissionTotals
}

export type AffiliateListResult =
  | { status: 'ok'; affiliates: AdminAffiliateListItem[] }
  | { status: 'setup_required' | 'not_configured' }

export type AffiliateDetailResult =
  | { status: 'ok'; detail: AdminAffiliateDetail }
  | { status: 'setup_required' | 'not_configured' | 'not_found' }

type MutationResult =
  | { success: true; affiliateId: string }
  | { success: false; error: 'setup_required' | 'not_configured' | 'mutation_failed' }

type CountResult = {
  count: number
  missingSetup: boolean
}

function sanitizeSearch(value: string): string {
  return value.replace(/[%_,]/g, '').trim()
}

function isMissingAffiliateSetup(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return (
    error.code === '42P01' ||
    error.code === '42703' ||
    error.code === 'PGRST205' ||
    error.message?.includes('affiliates') === true ||
    error.message?.includes('affiliate_clicks') === true ||
    error.message?.includes('affiliate_id') === true
  )
}

function emptyTotals(): AffiliateCommissionTotals {
  return { pending: 0, approved: 0, paid: 0 }
}

function totalsFromOrders(orders: Pick<AdminOrder, 'commission_status' | 'commission_amount_cents'>[]): AffiliateCommissionTotals {
  return orders.reduce((totals, order) => {
    const amount = order.commission_amount_cents ?? 0
    if (order.commission_status === 'pending') totals.pending += amount
    if (order.commission_status === 'approved') totals.approved += amount
    if (order.commission_status === 'paid') totals.paid += amount
    return totals
  }, emptyTotals())
}

async function countRows(
  table: 'affiliate_clicks' | 'orders',
  affiliateId: string
): Promise<CountResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { count: 0, missingSetup: true }

  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('affiliate_id', affiliateId)

  return {
    count: count ?? 0,
    missingSetup: isMissingAffiliateSetup(error),
  }
}

async function getOrdersForAffiliate(affiliateId: string, limit?: number): Promise<{
  orders: AdminOrder[]
  missingSetup: boolean
}> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { orders: [], missingSetup: true }

  let query = supabase
    .from('orders')
    .select('*')
    .eq('affiliate_id', affiliateId)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) return { orders: [], missingSetup: isMissingAffiliateSetup(error) }

  return { orders: (data ?? []) as AdminOrder[], missingSetup: false }
}

export async function listAdminAffiliates(input: {
  search?: string
  status?: string
}): Promise<AffiliateListResult> {
  const parsed = affiliateListFilterSchema.safeParse({
    search: input.search || undefined,
    status: input.status || undefined,
  })
  const filters = parsed.success ? parsed.data : {}

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { status: 'setup_required' }

  let query = supabase
    .from('affiliates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.search) {
    const search = sanitizeSearch(filters.search)
    if (search) {
      const pattern = `%${search}%`
      query = query.or(`code.ilike.${pattern},name.ilike.${pattern},instagram_handle.ilike.${pattern}`)
    }
  }

  const { data, error } = await query
  if (error) {
    return { status: isMissingAffiliateSetup(error) ? 'not_configured' : 'not_configured' }
  }

  const affiliates = (data ?? []) as AdminAffiliate[]
  const enriched = await Promise.all(
    affiliates.map(async (affiliate) => {
      const [clicks, orderCount, orderRows] = await Promise.all([
        countRows('affiliate_clicks', affiliate.id),
        countRows('orders', affiliate.id),
        getOrdersForAffiliate(affiliate.id),
      ])

      if (clicks.missingSetup || orderCount.missingSetup || orderRows.missingSetup) {
        return null
      }

      return {
        ...affiliate,
        clickCount: clicks.count,
        orderCount: orderCount.count,
        commissionTotals: totalsFromOrders(orderRows.orders),
      }
    })
  )

  if (enriched.some((affiliate) => affiliate === null)) {
    return { status: 'not_configured' }
  }

  return {
    status: 'ok',
    affiliates: enriched.filter((affiliate): affiliate is AdminAffiliateListItem => affiliate !== null),
  }
}

export async function getAdminAffiliateDetail(id: string): Promise<AffiliateDetailResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { status: 'setup_required' }

  const { data: affiliate, error: affiliateError } = await supabase
    .from('affiliates')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (affiliateError) {
    return { status: isMissingAffiliateSetup(affiliateError) ? 'not_configured' : 'not_configured' }
  }
  if (!affiliate) return { status: 'not_found' }

  const { data: clicks, error: clicksError, count: clickCount } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact' })
    .eq('affiliate_id', id)
    .order('created_at', { ascending: false })
    .limit(25)

  if (clicksError && isMissingAffiliateSetup(clicksError)) {
    return { status: 'not_configured' }
  }

  const ordersResult = await getOrdersForAffiliate(id)
  if (ordersResult.missingSetup) {
    return { status: 'not_configured' }
  }

  return {
    status: 'ok',
    detail: {
      affiliate: affiliate as AdminAffiliate,
      clicks: (clicks ?? []) as AdminAffiliateClick[],
      orders: ordersResult.orders.slice(0, 100),
      clickCount: clickCount ?? 0,
      orderCount: ordersResult.orders.length,
      commissionTotals: totalsFromOrders(ordersResult.orders),
    },
  }
}

export async function createAdminAffiliate(
  input: AdminAffiliateInput
): Promise<MutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase
    .from('affiliates')
    .insert(input)
    .select('id')
    .single()

  if (error || !data) {
    return {
      success: false,
      error: isMissingAffiliateSetup(error) ? 'not_configured' : 'mutation_failed',
    }
  }

  return { success: true, affiliateId: String(data.id) }
}

export async function updateAdminAffiliate(
  affiliateId: string,
  input: AdminAffiliateInput
): Promise<MutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase
    .from('affiliates')
    .update(input)
    .eq('id', affiliateId)
    .select('id')
    .single()

  if (error || !data) {
    return {
      success: false,
      error: isMissingAffiliateSetup(error) ? 'not_configured' : 'mutation_failed',
    }
  }

  return { success: true, affiliateId: String(data.id) }
}

export async function setAdminAffiliateStatus(
  affiliateId: string,
  status: AffiliateStatus
): Promise<MutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase
    .from('affiliates')
    .update({ status })
    .eq('id', affiliateId)
    .select('id')
    .single()

  if (error || !data) {
    return {
      success: false,
      error: isMissingAffiliateSetup(error) ? 'not_configured' : 'mutation_failed',
    }
  }

  return { success: true, affiliateId: String(data.id) }
}
