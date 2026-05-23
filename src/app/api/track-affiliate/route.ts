import { NextRequest, NextResponse } from 'next/server'
import {
  AFFILIATE_COOKIE_MAX_AGE_SECONDS,
  AFFILIATE_COOKIE_NAME,
  buildAffiliateCookieValue,
  hashRequestIp,
  resolveActiveAffiliateByCode,
  sanitizeAffiliateCode,
} from '@/lib/affiliate-tracking'
import { createSupabaseServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function truncate(value: string | null, maxLength = 500): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, maxLength) : null
}

function safeReferrer(value: string | null): string | null {
  if (!value) return null

  try {
    const url = new URL(value)
    return truncate(`${url.origin}${url.pathname}`)
  } catch {
    return null
  }
}

function cleanReturnUrl(request: NextRequest): URL {
  const fallback = new URL('/', request.url)
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/'

  if (!returnTo.startsWith('/')) return fallback

  try {
    const url = new URL(returnTo, request.url)
    if (url.origin !== request.nextUrl.origin) return fallback
    url.searchParams.delete('ref')
    url.searchParams.delete('affiliate_tracked')
    return url
  } catch {
    return fallback
  }
}

async function logAffiliateClick(input: {
  affiliateId: string
  affiliateCode: string
  landingPath: string
  searchParams: URLSearchParams
  request: NextRequest
}) {
  const supabase = createSupabaseServiceClient()
  if (!supabase) return

  await supabase.from('affiliate_clicks').insert({
    affiliate_id: input.affiliateId,
    affiliate_code: input.affiliateCode,
    landing_path: input.landingPath,
    utm_source: truncate(input.searchParams.get('utm_source')),
    utm_medium: truncate(input.searchParams.get('utm_medium')),
    utm_campaign: truncate(input.searchParams.get('utm_campaign')),
    utm_content: truncate(input.searchParams.get('utm_content')),
    utm_term: truncate(input.searchParams.get('utm_term')),
    referrer: safeReferrer(input.request.headers.get('referer')),
    user_agent: truncate(input.request.headers.get('user-agent')),
    ip_hash: hashRequestIp(input.request),
  })
}

export async function GET(request: NextRequest) {
  const redirectUrl = cleanReturnUrl(request)
  const response = NextResponse.redirect(redirectUrl)
  const code = sanitizeAffiliateCode(request.nextUrl.searchParams.get('ref'))

  if (!code) {
    return response
  }

  const affiliate = await resolveActiveAffiliateByCode(code)
  if (!affiliate) {
    return response
  }

  const landingPath = `${redirectUrl.pathname}${redirectUrl.search}`

  await logAffiliateClick({
    affiliateId: affiliate.id,
    affiliateCode: affiliate.code,
    landingPath,
    searchParams: redirectUrl.searchParams,
    request,
  })

  response.cookies.set(
    AFFILIATE_COOKIE_NAME,
    buildAffiliateCookieValue({
      affiliateCode: affiliate.code,
      landingPath,
      searchParams: redirectUrl.searchParams,
    }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AFFILIATE_COOKIE_MAX_AGE_SECONDS,
    }
  )

  return response
}
