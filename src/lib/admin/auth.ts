import 'server-only'

import { redirect } from 'next/navigation'
import { getAdminAllowedEmails } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type AdminProfile = {
  id: string
  auth_user_id: string
  email: string
  role: string
  is_active: boolean
}

export type AdminAccess =
  | { status: 'ok'; profile: AdminProfile; userEmail: string }
  | { status: 'setup_required' }
  | { status: 'unauthenticated' }
  | { status: 'denied' }

export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createSupabaseServerClient()
  const allowedEmails = getAdminAllowedEmails()

  if (!supabase || allowedEmails.length === 0) {
    return { status: 'setup_required' }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.email) {
    return { status: 'unauthenticated' }
  }

  const userEmail = user.email.toLowerCase()
  if (!allowedEmails.includes(userEmail)) {
    return { status: 'denied' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('id, auth_user_id, email, role, is_active')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .maybeSingle<AdminProfile>()

  if (profileError || !profile || profile.email.toLowerCase() !== userEmail) {
    return { status: 'denied' }
  }

  return { status: 'ok', profile, userEmail }
}

export async function requireAdmin() {
  const access = await getAdminAccess()

  if (access.status === 'unauthenticated') {
    redirect('/admin/login')
  }

  return access
}
