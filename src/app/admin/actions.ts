'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getAdminAccess } from '@/lib/admin/auth'
import { deleteOrderSchema, updateCommissionStatusSchema, updateOrderStatusSchema } from '@/lib/admin/schemas'
import {
  deleteAdminOrder,
  getAdminOrderDetail,
  updateAdminOrderCommissionStatus,
  updateAdminOrderStatus,
} from '@/lib/admin/orders'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type LoginState = {
  error?: string
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function loginAdmin(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Identifiants invalides.' }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return { error: 'Configuration admin requise.' }
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    return { error: 'Acces refuse.' }
  }

  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    await supabase.auth.signOut()
    return { error: 'Acces refuse.' }
  }

  redirect('/admin/orders')
}

export async function logoutAdmin() {
  const supabase = await createSupabaseServerClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  redirect('/admin/login')
}

export async function updateOrderStatusAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = updateOrderStatusSchema.safeParse({
    orderId: formData.get('orderId'),
    status: formData.get('status'),
    note: formData.get('note') || undefined,
  })

  if (!parsed.success) {
    redirect('/admin/orders')
  }

  const detail = await getAdminOrderDetail(parsed.data.orderId)
  if (!detail || detail.order.deleted_at) {
    redirect(`/admin/orders/${parsed.data.orderId}?error=deleted`)
  }

  const result = await updateAdminOrderStatus(
    parsed.data.orderId,
    parsed.data.status,
    parsed.data.note
  )

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${parsed.data.orderId}`)

  if (!result.success) {
    redirect(`/admin/orders/${parsed.data.orderId}?error=update`)
  }

  redirect(`/admin/orders/${parsed.data.orderId}?updated=1`)
}

export async function deleteOrderAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = deleteOrderSchema.safeParse({
    orderId: formData.get('orderId'),
    reason: formData.get('reason') || undefined,
    confirmDelete: formData.get('confirmDelete'),
  })

  if (!parsed.success) {
    redirect('/admin/orders?error=delete')
  }

  const result = await deleteAdminOrder(
    parsed.data.orderId,
    access.profile.auth_user_id,
    parsed.data.reason
  )

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${parsed.data.orderId}`)

  if (!result.success) {
    const errorParam = result.error === 'not_configured' ? 'delete_config' : 'delete'
    redirect(`/admin/orders/${parsed.data.orderId}?error=${errorParam}`)
  }

  redirect(`/admin/orders/${parsed.data.orderId}?deleted=1`)
}

export async function updateCommissionStatusAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = updateCommissionStatusSchema.safeParse({
    orderId: formData.get('orderId'),
    status: formData.get('status'),
    note: formData.get('note') || undefined,
  })

  if (!parsed.success) {
    redirect('/admin/orders')
  }

  const detail = await getAdminOrderDetail(parsed.data.orderId)
  if (!detail || detail.order.deleted_at) {
    redirect(`/admin/orders/${parsed.data.orderId}?error=deleted`)
  }

  const result = await updateAdminOrderCommissionStatus(
    parsed.data.orderId,
    parsed.data.status,
    parsed.data.note
  )

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${parsed.data.orderId}`)
  if (detail.order.affiliate_id) {
    revalidatePath('/admin/affiliates')
    revalidatePath(`/admin/affiliates/${detail.order.affiliate_id}`)
  }

  if (!result.success) {
    const errorParam = result.error === 'not_configured' ? 'commission_config' : 'commission'
    redirect(`/admin/orders/${parsed.data.orderId}?error=${errorParam}`)
  }

  redirect(`/admin/orders/${parsed.data.orderId}?commission_updated=1`)
}
