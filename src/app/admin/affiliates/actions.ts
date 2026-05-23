'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getAdminAccess } from '@/lib/admin/auth'
import {
  adminAffiliateIdSchema,
  adminAffiliateInputSchema,
  affiliateInputFromFormData,
} from '@/lib/admin/affiliate-schemas'
import {
  createAdminAffiliate,
  setAdminAffiliateStatus,
  updateAdminAffiliate,
} from '@/lib/admin/affiliates'
import { AFFILIATE_STATUSES } from '@/types/admin-affiliate'

const statusActionSchema = adminAffiliateIdSchema.extend({
  status: z.enum(AFFILIATE_STATUSES),
})

function errorParam(error?: string): string {
  return error === 'not_configured' ? 'config' : 'save'
}

function revalidateAffiliateAdmin(affiliateId?: string) {
  revalidatePath('/admin/affiliates')
  if (affiliateId) {
    revalidatePath(`/admin/affiliates/${affiliateId}`)
    revalidatePath(`/admin/affiliates/${affiliateId}/edit`)
  }
}

export async function createAffiliateAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = adminAffiliateInputSchema.safeParse(affiliateInputFromFormData(formData))
  if (!parsed.success) {
    redirect('/admin/affiliates/new?error=validation')
  }

  const result = await createAdminAffiliate(parsed.data)
  revalidateAffiliateAdmin(result.success ? result.affiliateId : undefined)

  if (!result.success) {
    redirect(`/admin/affiliates/new?error=${errorParam(result.error)}`)
  }

  redirect(`/admin/affiliates/${result.affiliateId}?created=1`)
}

export async function updateAffiliateAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const idParsed = adminAffiliateIdSchema.safeParse({
    affiliateId: formData.get('affiliateId'),
  })
  if (!idParsed.success) {
    redirect('/admin/affiliates?error=validation')
  }

  const parsed = adminAffiliateInputSchema.safeParse(affiliateInputFromFormData(formData))
  if (!parsed.success) {
    redirect(`/admin/affiliates/${idParsed.data.affiliateId}/edit?error=validation`)
  }

  const result = await updateAdminAffiliate(idParsed.data.affiliateId, parsed.data)
  revalidateAffiliateAdmin(idParsed.data.affiliateId)

  if (!result.success) {
    redirect(`/admin/affiliates/${idParsed.data.affiliateId}/edit?error=${errorParam(result.error)}`)
  }

  redirect(`/admin/affiliates/${idParsed.data.affiliateId}?updated=1`)
}

export async function setAffiliateStatusAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = statusActionSchema.safeParse({
    affiliateId: formData.get('affiliateId'),
    status: formData.get('status'),
  })

  if (!parsed.success) {
    redirect('/admin/affiliates?error=validation')
  }

  const result = await setAdminAffiliateStatus(parsed.data.affiliateId, parsed.data.status)
  revalidateAffiliateAdmin(parsed.data.affiliateId)

  if (!result.success) {
    redirect(`/admin/affiliates/${parsed.data.affiliateId}?error=${errorParam(result.error)}`)
  }

  redirect(`/admin/affiliates/${parsed.data.affiliateId}?updated=1`)
}
