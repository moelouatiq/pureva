// Optional serverless rate limiting helper.
// When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are present,
// install @upstash/ratelimit and @upstash/redis and replace this stub
// with the full Upstash implementation (Sprint 2).
//
// Without those env vars this function always returns { limited: false }
// and the API route continues normally — it never crashes.

export async function checkRateLimit(
  _ip: string
): Promise<{ limited: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return { limited: false }
  }

  // Full Upstash implementation goes here in Sprint 2.
  // npm install @upstash/ratelimit @upstash/redis
  return { limited: false }
}
