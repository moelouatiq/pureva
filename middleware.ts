import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { routing } from './src/i18n/routing'
import { updateSupabaseSession } from './src/lib/supabase/proxy'

const intlMiddleware = createMiddleware(routing)
const affiliateCodePattern = /^[a-z0-9][a-z0-9_-]{1,63}$/i

function shouldTrackAffiliate(request: NextRequest): boolean {
  if (request.method !== 'GET') return false

  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return false
  }

  const ref = request.nextUrl.searchParams.get('ref')?.trim()
  return Boolean(ref && affiliateCodePattern.test(ref))
}

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return updateSupabaseSession(request)
  }

  if (shouldTrackAffiliate(request)) {
    const trackUrl = new URL('/api/track-affiliate', request.url)
    trackUrl.searchParams.set('ref', request.nextUrl.searchParams.get('ref')!.trim().toLowerCase())
    trackUrl.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(trackUrl)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
