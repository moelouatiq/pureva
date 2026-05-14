import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { checkSupabaseServiceEnv } from '@/lib/env'

export function createSupabaseServiceClient() {
  if (!checkSupabaseServiceEnv().valid) return null

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
