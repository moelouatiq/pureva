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
  created_at: string
  updated_at: string
}

export type OrderEvent = {
  id: string
  order_id: string
  admin_user_id: string | null
  event_type: string
  old_status: OrderStatus | null
  new_status: OrderStatus | null
  note: string | null
  created_at: string
}
