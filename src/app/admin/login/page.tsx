import { redirect } from 'next/navigation'
import { getAdminAccess } from '@/lib/admin/auth'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const access = await getAdminAccess()

  if (access.status === 'ok') {
    redirect('/admin/orders')
  }

  const setupRequired = access.status === 'setup_required'

  return (
    <div className="flex min-h-[70vh] flex-col justify-center">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold-500">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-heading font-bold">Connexion</h1>
      </div>

      {setupRequired ? (
        <div className="max-w-lg rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">Configuration Supabase requise.</p>
          <p className="mt-2">
            Ajoutez les variables Supabase et ADMIN_ALLOWED_EMAILS, puis creez le profil admin
            dans Supabase avant d&apos;utiliser le panneau admin.
          </p>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}
