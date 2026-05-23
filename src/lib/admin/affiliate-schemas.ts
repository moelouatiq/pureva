import { z } from 'zod'
import { AFFILIATE_COMMISSION_TYPES, AFFILIATE_STATUSES } from '@/types/admin-affiliate'

const optionalText = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((value) => value || null)

const optionalContactText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((value) => value || null)

export const adminAffiliateInputSchema = z.object({
  code: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9][a-z0-9_-]{1,63}$/),
  name: z.string().trim().min(1).max(200),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => value || null)
    .refine((value) => !value || z.email().safeParse(value).success),
  phone: optionalContactText,
  instagram_handle: optionalContactText,
  commission_type: z.enum(AFFILIATE_COMMISSION_TYPES),
  commission_value: z.coerce.number().min(0).max(100000),
  status: z.enum(AFFILIATE_STATUSES),
  notes: optionalText,
})

export type AdminAffiliateInput = z.infer<typeof adminAffiliateInputSchema>

export const adminAffiliateIdSchema = z.object({
  affiliateId: z.string().uuid(),
})

export const affiliateListFilterSchema = z.object({
  status: z.enum(AFFILIATE_STATUSES).optional(),
  search: z.string().max(200).optional(),
})

export function affiliateInputFromFormData(formData: FormData) {
  return {
    code: formData.get('code'),
    name: formData.get('name'),
    email: formData.get('email') || undefined,
    phone: formData.get('phone') || undefined,
    instagram_handle: formData.get('instagram_handle') || undefined,
    commission_type: formData.get('commission_type'),
    commission_value: formData.get('commission_value'),
    status: formData.get('status'),
    notes: formData.get('notes') || undefined,
  }
}
