import { z } from 'zod'

// Shared Zod schema — used by OrderForm (client) and /api/order (server).
// Error messages are mapped to i18n keys by field path in the client component.
export const orderSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  product: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  message: z.string().max(1000).optional(),
  consent: z.literal(true),
  _hp: z.string().max(0),
  locale: z.enum(['fr', 'en']).default('fr'),
})

export type OrderSchemaInput = z.infer<typeof orderSchema>
