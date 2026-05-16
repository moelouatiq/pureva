import { z } from 'zod'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_PRICE_STATUSES,
  PRODUCT_PUBLICATION_STATUSES,
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

export const adminProductInputSchema = z
  .object({
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
    benefits_fr: z.array(z.string().trim().min(1).max(500)).max(20),
    benefits_en: z.array(z.string().trim().min(1).max(500)).max(20),
    ingredients_inci_fr: optionalText,
    ingredients_inci_en: optionalText,
    how_to_use_fr: optionalText,
    how_to_use_en: optionalText,
    precautions_fr: optionalText,
    precautions_en: optionalText,
    is_best_seller: z.boolean(),
    is_routine_product: z.boolean(),
    status: z.enum(PRODUCT_PUBLICATION_STATUSES),
    sort_order: z.preprocess((value) => Number(value || 0), z.number().int()),
    seo_title_fr: optionalText,
    seo_title_en: optionalText,
    seo_description_fr: optionalText,
    seo_description_en: optionalText,
  })
  .superRefine((data, ctx) => {
    if (data.price_status === 'confirmed' && (!data.price_cents || data.price_cents <= 0)) {
      ctx.addIssue({
        code: 'custom',
        path: ['price_cents'],
        message: 'A confirmed price must be a positive integer.',
      })
    }

    if (
      data.price_status === 'confirmed' &&
      data.compare_at_price_cents !== null &&
      data.price_cents !== null &&
      data.compare_at_price_cents <= data.price_cents
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['compare_at_price_cents'],
        message: 'Compare-at price must be greater than the confirmed price.',
      })
    }
  })

export type AdminProductInput = z.infer<typeof adminProductInputSchema>

export function productInputFromFormData(formData: FormData): Record<string, unknown> {
  return {
    legacy_id: formData.get('legacy_id'),
    slug_fr: String(formData.get('slug_fr') ?? ''),
    slug_en: String(formData.get('slug_en') ?? ''),
    name_fr: String(formData.get('name_fr') ?? ''),
    name_en: String(formData.get('name_en') ?? ''),
    short_description_fr: formData.get('short_description_fr'),
    short_description_en: formData.get('short_description_en'),
    long_description_fr: formData.get('long_description_fr'),
    long_description_en: formData.get('long_description_en'),
    category: String(formData.get('category') ?? ''),
    price_cents: formData.get('price_cents'),
    price_status: String(formData.get('price_status') ?? ''),
    compare_at_price_cents: formData.get('compare_at_price_cents'),
    currency: 'EUR',
    size: formData.get('size'),
    size_status: String(formData.get('size_status') ?? ''),
    stock_status: String(formData.get('stock_status') ?? ''),
    images: splitLines(formData.get('images')),
    benefits_fr: splitLines(formData.get('benefits_fr')),
    benefits_en: splitLines(formData.get('benefits_en')),
    ingredients_inci_fr: formData.get('ingredients_inci_fr'),
    ingredients_inci_en: formData.get('ingredients_inci_en'),
    how_to_use_fr: formData.get('how_to_use_fr'),
    how_to_use_en: formData.get('how_to_use_en'),
    precautions_fr: formData.get('precautions_fr'),
    precautions_en: formData.get('precautions_en'),
    is_best_seller: formData.get('is_best_seller') === 'on',
    is_routine_product: formData.get('is_routine_product') === 'on',
    status: String(formData.get('status') ?? ''),
    sort_order: formData.get('sort_order') ?? '0',
    seo_title_fr: formData.get('seo_title_fr'),
    seo_title_en: formData.get('seo_title_en'),
    seo_description_fr: formData.get('seo_description_fr'),
    seo_description_en: formData.get('seo_description_en'),
  }
}
