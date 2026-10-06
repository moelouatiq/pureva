import { z } from 'zod'
import {
  CHECKBOX_PRESENT_SUFFIX,
  PRODUCT_CATEGORIES,
  PRODUCT_PRICE_STATUSES,
  PRODUCT_PUBLICATION_STATUSES,
  PRODUCT_ROUTINE_STEPS,
  PRODUCT_SIZE_STATUSES,
  PRODUCT_STOCK_STATUSES,
} from '@/types/admin-product'

const emptyToNull = (value: unknown) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const optionalText = z.preprocess(emptyToNull, z.string().max(5000).nullable())
const requiredText = z.string().trim().min(1).max(500)

const nullableInteger = z.preprocess((value) => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string') return Number(value)
  return value
}, z.number().int().nullable())

const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'] as const
const blockedImageExtensions = [
  '.svg',
  '.gif',
  '.pdf',
  '.mp4',
  '.mov',
  '.avi',
  '.webm',
  '.mkv',
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.ps1',
  '.php',
  '.js',
  '.html',
  '.htm',
] as const

function hasAllowedImageExtension(pathname: string): boolean {
  const lowerPath = pathname.toLowerCase()
  return allowedImageExtensions.some((extension) => lowerPath.endsWith(extension))
}

function hasBlockedImageExtension(pathname: string): boolean {
  const lowerPath = pathname.toLowerCase()
  return blockedImageExtensions.some((extension) => lowerPath.endsWith(extension))
}

function isSafeLocalProductImagePath(value: string): boolean {
  if (!value.startsWith('/images/products/')) return false
  if (value.includes('\\') || value.includes('..')) return false
  const pathname = value.split(/[?#]/)[0] ?? ''
  return hasAllowedImageExtension(pathname) && !hasBlockedImageExtension(pathname)
}

function isSafeRemoteProductImageUrl(value: string): boolean {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }

  if (url.protocol !== 'https:') return false
  if (url.username || url.password) return false
  if (url.pathname.includes('\\') || url.pathname.includes('..')) return false
  if (!hasAllowedImageExtension(url.pathname) || hasBlockedImageExtension(url.pathname)) {
    return false
  }

  return true
}

const imagePathSchema = z
  .string()
  .trim()
  .min(1)
  .max(1000)
  .refine((value) => !/^(javascript|data):/i.test(value), {
    message: 'Image URLs must not use javascript: or data: schemes.',
  })
  .refine((value) => isSafeLocalProductImagePath(value) || isSafeRemoteProductImageUrl(value), {
    message: 'Use a safe /images/products/... path or an HTTPS JPG, PNG or WebP URL.',
  })

function splitLines(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return []
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export const adminProductListFilterSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.enum(PRODUCT_PUBLICATION_STATUSES).optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
})

export const adminProductIdSchema = z.object({
  productId: z.string().uuid(),
  note: z.string().trim().max(1000).optional(),
})

const adminProductFieldsSchema = z.object({
    legacy_id: z.preprocess(emptyToNull, z.string().max(100).nullable()),
    slug_fr: requiredText,
    slug_en: requiredText,
    name_fr: requiredText,
    name_en: requiredText,
    short_description_fr: optionalText,
    short_description_en: optionalText,
    long_description_fr: optionalText,
    long_description_en: optionalText,
    category: z.enum(PRODUCT_CATEGORIES),
    price_cents: nullableInteger,
    price_status: z.enum(PRODUCT_PRICE_STATUSES),
    compare_at_price_cents: nullableInteger,
    currency: z.literal('EUR'),
    size: optionalText,
    size_status: z.enum(PRODUCT_SIZE_STATUSES),
    stock_status: z.enum(PRODUCT_STOCK_STATUSES),
    images: z.array(imagePathSchema).max(12),
    image_alt_fr: z.array(z.string().trim().min(1).max(500)).max(12),
    image_alt_en: z.array(z.string().trim().min(1).max(500)).max(12),
    benefits_fr: z.array(z.string().trim().min(1).max(500)).max(20),
    benefits_en: z.array(z.string().trim().min(1).max(500)).max(20),
    key_ingredients_fr: z.array(z.string().trim().min(1).max(500)).max(40),
    key_ingredients_en: z.array(z.string().trim().min(1).max(500)).max(40),
    composition_note_fr: optionalText,
    composition_note_en: optionalText,
    ingredients_inci_fr: optionalText,
    ingredients_inci_en: optionalText,
    how_to_use_fr: optionalText,
    how_to_use_en: optionalText,
    precautions_fr: optionalText,
    precautions_en: optionalText,
    target_audience_fr: optionalText,
    target_audience_en: optionalText,
    usage_area_fr: optionalText,
    usage_area_en: optionalText,
    texture_fr: optionalText,
    texture_en: optionalText,
    color_fr: optionalText,
    color_en: optionalText,
    fragrance_fr: optionalText,
    fragrance_en: optionalText,
    packaging_fr: optionalText,
    packaging_en: optionalText,
    storage_instructions_fr: optionalText,
    storage_instructions_en: optionalText,
    is_best_seller: z.boolean(),
    is_routine_product: z.boolean(),
    show_on_homepage: z.boolean(),
    show_in_shop: z.boolean(),
    homepage_order: nullableInteger,
    shop_order: nullableInteger,
    routine_order: nullableInteger,
    routine_step: z.preprocess(emptyToNull, z.enum(PRODUCT_ROUTINE_STEPS).nullable()),
    status: z.enum(PRODUCT_PUBLICATION_STATUSES),
    sort_order: z.preprocess((value) => Number(value || 0), z.number().int()),
    seo_title_fr: optionalText,
    seo_title_en: optionalText,
    seo_description_fr: optionalText,
    seo_description_en: optionalText,
  })

type AdminProductFields = z.infer<typeof adminProductFieldsSchema>

// Cross-field checks. Written for partial (PATCH) input too: a rule only
// applies when the fields it compares are present in the payload. The DB RPC
// re-checks the publication price rule against the merged row.
function refineProductFields(data: Partial<AdminProductFields>, ctx: z.RefinementCtx) {
    if (
      data.price_status === 'confirmed' &&
      data.price_cents !== undefined &&
      (!data.price_cents || data.price_cents <= 0)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['price_cents'],
        message: 'A confirmed price must be a positive integer.',
      })
    }

    if (
      data.price_status === 'confirmed' &&
      data.compare_at_price_cents != null &&
      data.price_cents != null &&
      data.compare_at_price_cents <= data.price_cents
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['compare_at_price_cents'],
        message: 'Compare-at price must be greater than the confirmed price.',
      })
    }

    if (
      data.status === 'published' &&
      data.price_status !== undefined &&
      data.price_cents !== undefined &&
      (data.price_status !== 'confirmed' || data.price_cents === null || data.price_cents <= 0)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'A product needs a confirmed positive price before publication.',
      })
    }

    if (
      data.images !== undefined &&
      ((data.image_alt_fr?.length ?? 0) > data.images.length ||
        (data.image_alt_en?.length ?? 0) > data.images.length)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['images'],
        message: 'Image alt text entries must match an existing image.',
      })
    }
}

// Create: every required field must be present.
export const adminProductInputSchema = adminProductFieldsSchema.superRefine(refineProductFields)

// Update: PATCH semantics. Fields absent from the form are not sent, so the
// RPC keeps their stored value instead of overwriting them with null.
export const adminProductPatchSchema = adminProductFieldsSchema.partial().superRefine(refineProductFields)

export type AdminProductInput = z.infer<typeof adminProductInputSchema>
export type AdminProductPatch = z.infer<typeof adminProductPatchSchema>

const LIST_FIELDS = [
  'images',
  'image_alt_fr',
  'image_alt_en',
  'benefits_fr',
  'benefits_en',
  'key_ingredients_fr',
  'key_ingredients_en',
] as const

const CHECKBOX_FIELDS = ['is_best_seller', 'is_routine_product', 'show_on_homepage', 'show_in_shop'] as const

// Builds the product payload from the admin form. Only fields that the form
// actually rendered are included, so a form that lacks a field (older UI,
// partial form) can never wipe its stored value.
export function productInputFromFormData(formData: FormData): Record<string, unknown> {
  const input: Record<string, unknown> = {}
  const listFields: readonly string[] = LIST_FIELDS
  const checkboxFields: readonly string[] = CHECKBOX_FIELDS

  for (const key of Object.keys(adminProductFieldsSchema.shape)) {
    if (checkboxFields.includes(key)) {
      if (formData.has(key) || formData.has(`${key}${CHECKBOX_PRESENT_SUFFIX}`)) {
        input[key] = formData.get(key) === 'on'
      }
      continue
    }

    if (!formData.has(key)) continue

    if (listFields.includes(key)) {
      input[key] = splitLines(formData.get(key))
    } else {
      input[key] = formData.get(key)
    }
  }

  input.currency = 'EUR'
  return input
}
