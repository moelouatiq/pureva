import type { LocalizedString } from './locale'

export type ShippingZone = {
  id: string
  name: LocalizedString
  countries: string[]
  estimatedDelivery: LocalizedString
  note?: LocalizedString
  freeShippingThreshold?: number
}
