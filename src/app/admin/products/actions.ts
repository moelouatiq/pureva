'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminAccess } from '@/lib/admin/auth'
import { detectForbiddenClaims } from '@/lib/admin/product-claims'
import {
  adminProductIdSchema,
  adminProductInputSchema,
  adminProductPatchSchema,
  productInputFromFormData,
  type AdminProductPatch,
} from '@/lib/admin/product-schemas'
import {
  archiveAdminProduct,
  createAdminProduct,
  getAdminProductDetail,
  publishAdminProduct,
  updateAdminProduct,
} from '@/lib/admin/products'

function claimFields(product: AdminProductPatch): Record<string, string | string[]> {
  return {
    name_fr: product.name_fr ?? '',
    name_en: product.name_en ?? '',
    short_description_fr: product.short_description_fr ?? '',
    short_description_en: product.short_description_en ?? '',
    long_description_fr: product.long_description_fr ?? '',
    long_description_en: product.long_description_en ?? '',
    benefits_fr: product.benefits_fr ?? [],
    benefits_en: product.benefits_en ?? [],
    key_ingredients_fr: product.key_ingredients_fr ?? [],
    key_ingredients_en: product.key_ingredients_en ?? [],
    composition_note_fr: product.composition_note_fr ?? '',
    composition_note_en: product.composition_note_en ?? '',
    ingredients_inci_fr: product.ingredients_inci_fr ?? '',
    ingredients_inci_en: product.ingredients_inci_en ?? '',
    how_to_use_fr: product.how_to_use_fr ?? '',
    how_to_use_en: product.how_to_use_en ?? '',
    precautions_fr: product.precautions_fr ?? '',
    precautions_en: product.precautions_en ?? '',
    target_audience_fr: product.target_audience_fr ?? '',
    target_audience_en: product.target_audience_en ?? '',
    usage_area_fr: product.usage_area_fr ?? '',
    usage_area_en: product.usage_area_en ?? '',
    seo_title_fr: product.seo_title_fr ?? '',
    seo_title_en: product.seo_title_en ?? '',
    seo_description_fr: product.seo_description_fr ?? '',
    seo_description_en: product.seo_description_en ?? '',
  }
}

function mutationErrorParam(error?: string): string {
  return error === 'not_configured' ? 'config' : 'save'
}

function revalidateProductAdmin(productId?: string) {
  // Public catalog pages use ISR; refresh every localized page so visibility,
  // order and publication changes show up without waiting for the next window.
  revalidatePath('/[locale]', 'layout')
  revalidatePath('/admin/products')
  if (productId) {
    revalidatePath(`/admin/products/${productId}/edit`)
  }
}

export async function createProductAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = adminProductInputSchema.safeParse(productInputFromFormData(formData))
  if (!parsed.success) {
    redirect('/admin/products/new?error=validation')
  }

  const warnings = detectForbiddenClaims(claimFields(parsed.data))
  if (parsed.data.status === 'published' && warnings.length > 0) {
    redirect('/admin/products/new?error=claims')
  }

  const result = await createAdminProduct(
    access.profile.auth_user_id,
    parsed.data,
    'Product created from admin'
  )

  revalidateProductAdmin(result.success ? result.productId : undefined)

  if (!result.success) {
    redirect(`/admin/products/new?error=${mutationErrorParam(result.error)}`)
  }

  redirect(`/admin/products/${result.productId}/edit?created=1`)
}

export async function updateProductAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const productId = String(formData.get('productId') ?? '')
  const idParsed = adminProductIdSchema.safeParse({ productId })
  if (!idParsed.success) {
    redirect('/admin/products?error=validation')
  }

  const parsed = adminProductPatchSchema.safeParse(productInputFromFormData(formData))
  if (!parsed.success) {
    redirect(`/admin/products/${productId}/edit?error=validation`)
  }

  const warnings = detectForbiddenClaims(claimFields(parsed.data))
  if (parsed.data.status === 'published' && warnings.length > 0) {
    redirect(`/admin/products/${productId}/edit?error=claims`)
  }

  const result = await updateAdminProduct(
    productId,
    access.profile.auth_user_id,
    parsed.data,
    'Product updated from admin'
  )

  revalidateProductAdmin(productId)

  if (!result.success) {
    redirect(`/admin/products/${productId}/edit?error=${mutationErrorParam(result.error)}`)
  }

  redirect(`/admin/products/${productId}/edit?updated=1`)
}

export async function publishProductAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = adminProductIdSchema.safeParse({
    productId: formData.get('productId'),
    note: formData.get('note') || undefined,
  })
  if (!parsed.success) {
    redirect('/admin/products?error=validation')
  }

  const detail = await getAdminProductDetail(parsed.data.productId)
  if (!detail) {
    redirect('/admin/products?error=not_found')
  }

  const warnings = detectForbiddenClaims({
    name_fr: detail.product.name_fr,
    name_en: detail.product.name_en,
    short_description_fr: detail.product.short_description_fr ?? '',
    short_description_en: detail.product.short_description_en ?? '',
    long_description_fr: detail.product.long_description_fr ?? '',
    long_description_en: detail.product.long_description_en ?? '',
    benefits_fr: detail.product.benefits_fr,
    benefits_en: detail.product.benefits_en,
    key_ingredients_fr: detail.product.key_ingredients_fr ?? [],
    key_ingredients_en: detail.product.key_ingredients_en ?? [],
    composition_note_fr: detail.product.composition_note_fr ?? '',
    composition_note_en: detail.product.composition_note_en ?? '',
    ingredients_inci_fr: detail.product.ingredients_inci_fr ?? '',
    ingredients_inci_en: detail.product.ingredients_inci_en ?? '',
    how_to_use_fr: detail.product.how_to_use_fr ?? '',
    how_to_use_en: detail.product.how_to_use_en ?? '',
    precautions_fr: detail.product.precautions_fr ?? '',
    precautions_en: detail.product.precautions_en ?? '',
    target_audience_fr: detail.product.target_audience_fr ?? '',
    target_audience_en: detail.product.target_audience_en ?? '',
    usage_area_fr: detail.product.usage_area_fr ?? '',
    usage_area_en: detail.product.usage_area_en ?? '',
    seo_title_fr: detail.product.seo_title_fr ?? '',
    seo_title_en: detail.product.seo_title_en ?? '',
    seo_description_fr: detail.product.seo_description_fr ?? '',
    seo_description_en: detail.product.seo_description_en ?? '',
  })

  if (warnings.length > 0) {
    redirect(`/admin/products/${parsed.data.productId}/edit?error=claims`)
  }

  if (
    detail.product.price_status !== 'confirmed' ||
    detail.product.price_cents === null ||
    detail.product.price_cents <= 0
  ) {
    redirect(`/admin/products/${parsed.data.productId}/edit?error=price`)
  }

  const result = await publishAdminProduct(
    parsed.data.productId,
    access.profile.auth_user_id,
    parsed.data.note
  )

  revalidateProductAdmin(parsed.data.productId)

  if (!result.success) {
    redirect(`/admin/products/${parsed.data.productId}/edit?error=${mutationErrorParam(result.error)}`)
  }

  redirect(`/admin/products/${parsed.data.productId}/edit?published=1`)
}

export async function archiveProductAction(formData: FormData) {
  const access = await getAdminAccess()
  if (access.status !== 'ok') {
    redirect('/admin/login')
  }

  const parsed = adminProductIdSchema.safeParse({
    productId: formData.get('productId'),
    note: formData.get('note') || undefined,
  })
  if (!parsed.success) {
    redirect('/admin/products?error=validation')
  }

  const result = await archiveAdminProduct(
    parsed.data.productId,
    access.profile.auth_user_id,
    parsed.data.note
  )

  revalidateProductAdmin(parsed.data.productId)

  if (!result.success) {
    redirect(`/admin/products/${parsed.data.productId}/edit?error=${mutationErrorParam(result.error)}`)
  }

  redirect(`/admin/products/${parsed.data.productId}/edit?archived=1`)
}
