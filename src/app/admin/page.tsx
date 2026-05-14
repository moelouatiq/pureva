import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

export default async function AdminIndexPage() {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour acceder au panneau admin.
      </div>
    )
  }

  if (access.status !== 'ok') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Acces refuse.
      </div>
    )
  }

  redirect('/admin/orders')
}
