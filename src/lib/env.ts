// Environment variable documentation and runtime validation helpers.
// Never called at module import time — only called inside server functions or API routes.
// The build must not fail when email vars are absent.

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3010'
}

export type EmailEnvCheck = {
  valid: boolean
  missing: string[]
}

export function checkEmailEnv(): EmailEnvCheck {
  const required = ['RESEND_API_KEY', 'BUSINESS_EMAIL', 'FROM_EMAIL'] as const
  const missing = required.filter((key) => !process.env[key])
  return { valid: missing.length === 0, missing }
}

// Optional env vars — absence is not an error, but document them here.
// UPSTASH_REDIS_REST_URL   — rate limiting (graceful no-op when absent)
// UPSTASH_REDIS_REST_TOKEN — rate limiting (graceful no-op when absent)
// NEXT_PUBLIC_WHATSAPP_NUMBER — WhatsApp CTAs (hidden when absent)
// LEGAL_CONTENT_CONFIRMED  — set to "true" to remove noindex from legal pages
