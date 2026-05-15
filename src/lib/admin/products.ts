import 'server-only'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { adminProductListFilterSchema, type AdminProductInput } from '@/lib/admin/product-schemas'
import type { AdminProduct, AdminProductEvent } from '@/types/admin-product'

export type AdminProductDetail = {
  product: AdminProduct
  events: AdminProductEvent[]
}

type ListProductsInput = {
  search?: string
  status?: string
  category?: string
}

type ProductMutationResult =
  | { success: true; productId: string }
  | { success: false; error: 'setup_required' | 'not_configured' | 'mutation_failed' }

function sanitizeSearch(value: string): string {
  return value.replace(/[%_,]/g, '').trim()
}

function isMissingRpc(error: { code?: string; message?: string } | null): boolean {
  return error?.code === 'PGRST202' || error?.code === '42883'
}

export async function listAdminProducts(input: ListProductsInput): Promise<AdminProduct[]> {
  const parsed = adminProductListFilterSchema.safeParse({
    search: input.search || undefined,
    status: input.status || undefined,
    category: input.category || undefined,
  })
  const filters = parsed.success ? parsed.data : {}

  const supabase = await createSupabaseServerClient()
  if (!supabase) return []

  let query = supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false })
    .limit(200)

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.search) {
    const search = sanitizeSearch(filters.search)
    if (search) {
      const pattern = `%${search}%`
      query = query.or(
        `name_fr.ilike.${pattern},name_en.ilike.${pattern},slug_fr.ilike.${pattern},slug_en.ilike.${pattern},legacy_id.ilike.${pattern}`
      )
    }
  }

  const { data, error } = await query
  if (error || !data) return []

  return data as AdminProduct[]
}

export async function getAdminProductDetail(id: string): Promise<AdminProductDetail | null> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (productError || !product) return null

  const { data: events } = await supabase
    .from('admin_product_events')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  return {
    product: product as AdminProduct,
    events: (events ?? []) as AdminProductEvent[],
  }
}

export async function createAdminProduct(
  adminUserId: string,
  product: AdminProductInput,
  note?: string
): Promise<ProductMutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase.rpc('create_product_with_event', {
    p_admin_user_id: adminUserId,
    p_product: product,
    p_note: note || null,
  })

  if (error || !data) {
    return { success: false, error: isMissingRpc(error) ? 'not_configured' : 'mutation_failed' }
  }

  return { success: true, productId: (data as AdminProduct).id }
}

export async function updateAdminProduct(
  productId: string,
  adminUserId: string,
  product: AdminProductInput,
  note?: string
): Promise<ProductMutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase.rpc('update_product_with_event', {
    p_product_id: productId,
    p_admin_user_id: adminUserId,
    p_product: product,
    p_note: note || null,
  })

  if (error || !data) {
    return { success: false, error: isMissingRpc(error) ? 'not_configured' : 'mutation_failed' }
  }

  return { success: true, productId: (data as AdminProduct).id }
}

export async function publishAdminProduct(
  productId: string,
  adminUserId: string,
  note?: string
): Promise<ProductMutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase.rpc('publish_product_with_event', {
    p_product_id: productId,
    p_admin_user_id: adminUserId,
    p_note: note || null,
  })

  if (error || !data) {
    return { success: false, error: isMissingRpc(error) ? 'not_configured' : 'mutation_failed' }
  }

  return { success: true, productId: (data as AdminProduct).id }
}

export async function archiveAdminProduct(
  productId: string,
  adminUserId: string,
  note?: string
): Promise<ProductMutationResult> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { success: false, error: 'setup_required' }

  const { data, error } = await supabase.rpc('archive_product_with_event', {
    p_product_id: productId,
    p_admin_user_id: adminUserId,
    p_note: note || null,
  })

  if (error || !data) {
    return { success: false, error: isMissingRpc(error) ? 'not_configured' : 'mutation_failed' }
  }

  return { success: true, productId: (data as AdminProduct).id }
}
