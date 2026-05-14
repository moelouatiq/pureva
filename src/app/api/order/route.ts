import { NextRequest, NextResponse } from 'next/server'
import { isProductVisible, products } from '@/data/products'
import { orderSchema } from '@/lib/order-schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendOrderNotification, sendOrderConfirmation } from '@/lib/resend'
import { formatPrice } from '@/lib/format-price'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { persistOrderEmailEvent, persistOrderWithCreatedEvent } from '@/lib/order-persistence'
import type { Locale } from '@/types/locale'

export const dynamic = 'force-dynamic'

function generateOrderReference(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `PUREVA-${dateStr}-${suffix}`
}

function extractIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

function formatTimestamp(locale: Locale): string {
  return new Date().toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  })
}

function logEmailFailure(
  orderReference: string,
  stage: 'business_email_failed' | 'customer_email_failed',
  error?: string
) {
  console.warn('[api/order] Email notification failed', {
    orderReference,
    stage,
    error: error ?? 'unknown',
  })
}

export async function POST(request: NextRequest) {
  // 1. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // 2. Zod validation
  const parsed = orderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }

  const data = parsed.data

  // 3. Honeypot check (belt-and-suspenders — Zod already enforces max(0))
  if (data._hp !== '') {
    // Silent rejection — do not confirm spam detection to the client
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // 4. Consent must be exactly true (Zod literal already enforces this)
  // Additional explicit check for clarity
  if (data.consent !== true) {
    return NextResponse.json({ error: 'Consent required' }, { status: 400 })
  }

  // 5. Rate limit (optional — skipped if Upstash env vars missing)
  const ip = extractIp(request)
  const { limited } = await checkRateLimit(ip)
  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429 }
    )
  }

  // 6. Resolve product
  const product = products.find((p) => p.id === data.product && isProductVisible(p))
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 400 })
  }

  // 7. Build order data
  const locale = data.locale as Locale
  const orderReference = generateOrderReference()
  const timestamp = formatTimestamp(locale)

  const productName = product.name[locale] ?? product.name.fr

  // 8. Persist order before sending any emails.
  const persisted = await persistOrderWithCreatedEvent({
    orderReference,
    locale,
    customerName: data.name,
    customerEmail: data.email,
    customerPhone: data.phone,
    customerCountry: data.country,
    customerAddress: data.address,
    product,
    quantity: data.quantity,
    customerMessage: data.message,
  })

  if (!persisted.success) {
    console.error('[api/order] Order persistence failed:', persisted.error)
    return NextResponse.json(
      { error: 'Failed to process order. Please try again or contact us via WhatsApp.' },
      { status: 500 }
    )
  }

  let unitPrice: string | undefined
  let subtotal: string | undefined
  if (product.priceStatus === 'confirmed' && product.price > 0) {
    unitPrice = formatPrice(product.price, locale)
    subtotal = formatPrice(product.price * data.quantity, locale)
  }

  const waMsg =
    locale === 'fr'
      ? `Bonjour, j'ai soumis la commande ${orderReference} et souhaite avoir une confirmation.`
      : `Hello, I submitted order ${orderReference} and would like a confirmation.`
  const waFollowUpUrl = buildWhatsAppUrl(waMsg)

  const emailData = {
    orderReference,
    customerName: data.name,
    customerEmail: data.email,
    customerPhone: data.phone,
    country: data.country,
    address: data.address,
    productName,
    quantity: data.quantity,
    message: data.message,
    priceStatus: product.priceStatus,
    unitPrice,
    subtotal,
    locale,
    timestamp,
    waFollowUpUrl: waFollowUpUrl === '#' ? '' : waFollowUpUrl,
  }

  // 9. Email sending is best-effort after persistence. The database/admin panel
  // is the source of truth, so email issues must not make customers retry.
  if (!process.env.RESEND_API_KEY || !process.env.BUSINESS_EMAIL || !process.env.FROM_EMAIL) {
    logEmailFailure(orderReference, 'business_email_failed', 'email_env_missing')
    await persistOrderEmailEvent(orderReference, 'business_email_failed')
    await persistOrderEmailEvent(orderReference, 'customer_email_failed')
    return NextResponse.json({ success: true, orderReference }, { status: 200 })
  }

  const notifResult = await sendOrderNotification(emailData)

  if (!notifResult.success) {
    logEmailFailure(orderReference, 'business_email_failed', notifResult.error)
    await persistOrderEmailEvent(orderReference, 'business_email_failed')
  }

  const confirmResult = await sendOrderConfirmation(emailData)

  if (!confirmResult.success) {
    logEmailFailure(orderReference, 'customer_email_failed', confirmResult.error)
    await persistOrderEmailEvent(orderReference, 'customer_email_failed')
  }

  // 10. Success
  return NextResponse.json({ success: true, orderReference }, { status: 200 })
}
