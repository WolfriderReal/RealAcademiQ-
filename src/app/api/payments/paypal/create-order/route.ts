import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'PayPal payments are no longer supported. Please use M-Pesa.' },
    { status: 410 }
  )
}
