export const ORDER_STATUSES = [
  'new',
  'contacted',
  'confirmed',
  'preparing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export const COMMISSION_STATUSES = ['none', 'pending', 'approved', 'rejected', 'paid'] as const
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number]

export type AdminOrder = {
  id: string
  order_reference: string
  locale: 'fr' | 'en'
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_country: string
  customer_address: string
  product_id: string
  product_name: string
  product_slug: string | null
  quantity: number
  unit_price_cents: number | null
  subtotal_cents: number | null
  price_status: 'confirmed' | 'placeholder'
  currency: 'EUR'
  customer_message: string | null
  status: OrderStatus
  source: string
  affiliate_id?: string | null
  affiliate_code?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
  landing_path?: string | null
  attribution_source?: string | null
  commission_status?: CommissionStatus
  commission_amount_cents?: number | null
  commission_currency?: 'EUR'
  deleted_at: string | null
  deleted_by: string | null
  delete_reason: string | null
  created_at: string
  updated_at: string
}

export type OrderEvent = {
  id: string
  order_id: string
  admin_user_id: string | null
  event_type: string
  old_status: string | null
  new_status: string | null
  note: string | null
  created_at: string
}
