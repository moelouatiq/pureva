const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export function buildWhatsAppUrl(message: string): string {
  if (!phone) return '#'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
