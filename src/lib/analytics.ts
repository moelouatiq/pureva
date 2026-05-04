// Analytics stubs — inactive in MVP.
// Replace function bodies with GA4 / Pixel calls in Phase 1.5.
// Gate all calls behind CookieBanner consent before activating.

export type AnalyticsEvent =
  | 'page_view'
  | 'view_product'
  | 'view_routine_pack'
  | 'whatsapp_click'
  | 'order_form_start'
  | 'order_submitted'

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>
): void {
  void event
  void params
}
