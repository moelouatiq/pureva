import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'
import { orderSchema } from '@/lib/order-schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendOrderNotification, sendOrderConfirmation } from '@/lib/resend'
import { formatPrice } from '@/lib/format-price'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { Locale } from '@/types/locale'

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
  const product = products.find((p) => p.id === data.product)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 400 })
  }

  // 7. Check required email env vars
  if (!process.env.RESEND_API_KEY || !process.env.BUSINESS_EMAIL || !process.env.FROM_EMAIL) {
    console.error('[api/order] Missing required email environment variables')
    return NextResponse.json(
      { error: 'Order service is not fully configured. Please contact us via WhatsApp.' },
      { status: 500 }
    )
  }

  // 8. Build order data
  const locale = data.locale as Locale
  const orderReference = generateOrderReference()
  const timestamp = formatTimestamp(locale)

  const productName = product.name[locale] ?? product.name.fr

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

  // 9. Send emails (both — if one fails we still return success to avoid double orders)
  const [notifResult, confirmResult] = await Promise.all([
    sendOrderNotification(emailData),
    sendOrderConfirmation(emailData),
  ])

  if (!notifResult.success) {
    // Business notification failed — critical, return error
    console.error('[api/order] Business notification failed:', notifResult.error)
    return NextResponse.json(
      { error: 'Failed to process order. Please try again or contact us via WhatsApp.' },
      { status: 500 }
    )
  }

  if (!confirmResult.success) {
    // Customer confirmation failed — log but still return success (business was notified)
    console.warn('[api/order] Customer confirmation failed:', confirmResult.error)
  }

  // 10. Success
  return NextResponse.json({ success: true, orderReference }, { status: 200 })
}
