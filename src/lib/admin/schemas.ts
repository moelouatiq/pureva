import { z } from 'zod'
import { ORDER_STATUSES } from '@/types/admin-order'

export const orderStatusSchema = z.enum(ORDER_STATUSES)

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: orderStatusSchema,
  note: z.string().max(1000).optional(),
})

export const orderListFilterSchema = z.object({
  status: orderStatusSchema.optional(),
  search: z.string().max(200).optional(),
  showDeleted: z.boolean().optional(),
})

export const deleteOrderSchema = z.object({
  orderId: z.string().uuid(),
  reason: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((value) => value || undefined),
  confirmDelete: z.literal('on'),
})
