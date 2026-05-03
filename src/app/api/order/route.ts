import { NextResponse } from 'next/server'

// Sprint 0 stub — full implementation in Sprint 2
// Will add: Zod validation, honeypot check, optional rate limiting, Resend email send
export async function POST() {
  return NextResponse.json(
    { message: 'Order API — Sprint 0 placeholder' },
    { status: 200 }
  )
}
