// Resend email wrapper — wired up in Sprint 2 when the order API is built.
// Requires RESEND_API_KEY, BUSINESS_EMAIL, FROM_EMAIL environment variables.

export type OrderEmailData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  country: string
  address: string
  product: string
  quantity: number
  message?: string
}

export async function sendOrderNotification(
  _data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  // Stub — replace in Sprint 2
  return { success: true }
}

export async function sendOrderConfirmation(
  _customerEmail: string,
  _data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  // Stub — replace in Sprint 2
  return { success: true }
}
