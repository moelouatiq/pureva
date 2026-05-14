import 'server-only'

import type { Product } from '@/types/product'
import type { Locale } from '@/types/locale'
import { createSupabaseServiceClient } from '@/lib/supabase/service'

type PersistOrderInput = {
  orderReference: string
  locale: Locale
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCountry: string
  customerAddress: string
  product: Product
  quantity: number
  customerMessage?: string
}

export async function persistOrderWithCreatedEvent(input: PersistOrderInput): Promise<{
  success: boolean
  error?: 'not_configured' | 'insert_failed'
}> {
  const supabase = createSupabaseServiceClient()
  if (!supabase) return { success: false, error: 'not_configured' }

  const productName = input.product.name[input.locale] ?? input.product.name.fr
  const productSlug = input.product.slug[input.locale] ?? input.product.slug.fr
  const hasConfirmedPrice = input.product.priceStatus === 'confirmed' && input.product.price > 0
  const unitPriceCents = hasConfirmedPrice ? input.product.price : null
  const subtotalCents = hasConfirmedPrice ? input.product.price * input.quantity : null

  const { error } = await supabase.rpc('create_order_with_event', {
    p_order_reference: input.orderReference,
    p_locale: input.locale,
    p_customer_name: input.customerName,
    p_customer_email: input.customerEmail,
    p_customer_phone: input.customerPhone,
    p_customer_country: input.customerCountry,
    p_customer_address: input.customerAddress,
    p_product_id: input.product.id,
    p_product_name: productName,
    p_product_slug: productSlug,
    p_quantity: input.quantity,
    p_unit_price_cents: unitPriceCents,
    p_subtotal_cents: subtotalCents,
    p_price_status: input.product.priceStatus,
    p_currency: input.product.currency,
    p_customer_message: input.customerMessage || null,
    p_source: 'website',
  })

  if (error) {
    return { success: false, error: 'insert_failed' }
  }

  return { success: true }
}

export async function persistOrderEmailEvent(
  orderReference: string,
  eventType: 'business_email_failed' | 'customer_email_failed'
): Promise<void> {
  const supabase = createSupabaseServiceClient()
  if (!supabase) return

  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('order_reference', orderReference)
    .maybeSingle()

  if (!order?.id) return

  await supabase.from('order_events').insert({
    order_id: order.id,
    event_type: eventType,
    note: 'Email notification failed after order creation.',
  })
}
