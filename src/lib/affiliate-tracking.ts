import 'server-only'

import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'

export const AFFILIATE_COOKIE_NAME = 'pureva_affiliate_ref'
export const AFFILIATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export type AffiliateAttributionCookie = {
  affiliateCode: string
  landingPath: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  capturedAt: string
}

export type ActiveAffiliateForTracking = {
  id: string
  code: string
  commission_type: 'percentage' | 'fixed'
  commission_value: number
}

export type OrderAffiliateAttribution = {
  affiliateId: string
  affiliateCode: string
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  landingPath: string | null
  attributionSource: 'affiliate_cookie'
  commissionStatus: 'none' | 'pending'
  commissionAmountCents: number | null
  commissionCurrency: 'EUR'
}

type AffiliateCookieInput = {
  affiliateCode: string
  landingPath: string | null
  searchParams: URLSearchParams
}

const AFFILIATE_CODE_PATTERN = /^[a-z0-9][a-z0-9_-]{1,63}$/

function stringOrNull(value: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, 500) : null
}

export function sanitizeAffiliateCode(value: string | null | undefined): string | null {
  if (!value) return null
  const code = value.trim().toLowerCase()
  return AFFILIATE_CODE_PATTERN.test(code) ? code : null
}

export function buildAffiliateCookieValue(input: AffiliateCookieInput): string {
  const payload: AffiliateAttributionCookie = {
    affiliateCode: input.affiliateCode,
    landingPath: input.landingPath,
    utmSource: stringOrNull(input.searchParams.get('utm_source')),
    utmMedium: stringOrNull(input.searchParams.get('utm_medium')),
    utmCampaign: stringOrNull(input.searchParams.get('utm_campaign')),
    utmContent: stringOrNull(input.searchParams.get('utm_content')),
    utmTerm: stringOrNull(input.searchParams.get('utm_term')),
    capturedAt: new Date().toISOString(),
  }

  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

export function parseAffiliateCookie(value: string | undefined): AffiliateAttributionCookie | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<AffiliateAttributionCookie>
    const affiliateCode = sanitizeAffiliateCode(parsed.affiliateCode)
    if (!affiliateCode) return null

    return {
      affiliateCode,
      landingPath: typeof parsed.landingPath === 'string' ? parsed.landingPath.slice(0, 1000) : null,
      utmSource: stringOrNull(typeof parsed.utmSource === 'string' ? parsed.utmSource : null),
      utmMedium: stringOrNull(typeof parsed.utmMedium === 'string' ? parsed.utmMedium : null),
      utmCampaign: stringOrNull(typeof parsed.utmCampaign === 'string' ? parsed.utmCampaign : null),
      utmContent: stringOrNull(typeof parsed.utmContent === 'string' ? parsed.utmContent : null),
      utmTerm: stringOrNull(typeof parsed.utmTerm === 'string' ? parsed.utmTerm : null),
      capturedAt: typeof parsed.capturedAt === 'string' ? parsed.capturedAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function hashRequestIp(request: NextRequest): string | null {
  const salt = process.env.AFFILIATE_IP_HASH_SALT
  if (!salt) return null

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim()
  if (!ip) return null

  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

export async function resolveActiveAffiliateByCode(
  code: string
): Promise<ActiveAffiliateForTracking | null> {
  const affiliateCode = sanitizeAffiliateCode(code)
  if (!affiliateCode) return null

  const supabase = createSupabaseServiceClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('affiliates')
    .select('id, code, commission_type, commission_value, status')
    .eq('code', affiliateCode)
    .eq('status', 'active')
    .maybeSingle()

  if (error || !data) return null

  return {
    id: String(data.id),
    code: String(data.code),
    commission_type: data.commission_type === 'fixed' ? 'fixed' : 'percentage',
    commission_value: Number(data.commission_value ?? 0),
  }
}

export async function buildOrderAffiliateAttribution(
  cookieValue: string | undefined,
  subtotalCents: number | null
): Promise<OrderAffiliateAttribution | null> {
  const cookie = parseAffiliateCookie(cookieValue)
  if (!cookie) return null

  const affiliate = await resolveActiveAffiliateByCode(cookie.affiliateCode)
  if (!affiliate) return null

  const hasCalculableSubtotal = typeof subtotalCents === 'number' && subtotalCents > 0
  let commissionAmountCents: number | null = null
  let commissionStatus: 'none' | 'pending' = 'none'

  if (hasCalculableSubtotal) {
    commissionAmountCents =
      affiliate.commission_type === 'fixed'
        ? Math.round(affiliate.commission_value * 100)
        : Math.round((subtotalCents * affiliate.commission_value) / 100)
    commissionStatus = commissionAmountCents > 0 ? 'pending' : 'none'
  }

  return {
    affiliateId: affiliate.id,
    affiliateCode: affiliate.code,
    utmSource: cookie.utmSource,
    utmMedium: cookie.utmMedium,
    utmCampaign: cookie.utmCampaign,
    utmContent: cookie.utmContent,
    utmTerm: cookie.utmTerm,
    landingPath: cookie.landingPath,
    attributionSource: 'affiliate_cookie',
    commissionStatus,
    commissionAmountCents,
    commissionCurrency: 'EUR',
  }
}
