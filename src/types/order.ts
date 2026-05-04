export type OrderFormPayload = {
  name: string
  email: string
  phone: string
  country: string
  address: string
  product: string
  quantity: number
  message?: string
  consent: true
  _hp: string
  locale: 'fr' | 'en'
}

export type OrderApiResponse =
  | { success: true; orderReference: string }
  | { error: string }
