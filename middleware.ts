import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './src/i18n/routing'
import { updateSupabaseSession } from './src/lib/supabase/proxy'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return updateSupabaseSession(request)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
