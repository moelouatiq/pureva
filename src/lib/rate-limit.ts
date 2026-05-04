// Optional rate limiting via Upstash Redis REST API (no SDK dependency).
// When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are absent,
// this function returns { limited: false } immediately — the API route continues normally.
//
// Implementation: INCR + EXPIRE pipeline (fixed-window with activity extension).
// The 10-minute expiry resets on each request, so repeated attempts never open a fresh window.
// Limitation vs true fixed window: burst of 5 at end of window + 5 at start of next is not possible
// because the window extends on activity. Acceptable at MVP order volume.
//
// Key format: pureva:order:{ip}
// Window: 600 s (10 min), max 5 submissions per window.

const MAX_REQUESTS = 5
const WINDOW_SECONDS = 600

export async function checkRateLimit(ip: string): Promise<{ limited: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return { limited: false }
  }

  const key = `pureva:order:${ip}`
  const baseUrl = url.replace(/\/$/, '')

  try {
    const res = await fetch(`${baseUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, WINDOW_SECONDS],
      ]),
    })

    if (!res.ok) {
      console.warn('[rate-limit] Upstash pipeline returned non-OK status:', res.status)
      return { limited: false }
    }

    const data = (await res.json()) as [{ result: number }, { result: number }]
    const count = data[0]?.result ?? 0

    return { limited: count > MAX_REQUESTS }
  } catch {
    console.warn('[rate-limit] Upstash request failed — skipping rate limit for this request')
    return { limited: false }
  }
}
