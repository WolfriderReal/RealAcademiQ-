import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'PayPal webhooks are no longer supported.' },
    { status: 410 }
  )
}
