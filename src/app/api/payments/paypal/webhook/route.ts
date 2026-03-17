import { NextResponse } from 'next/server'

function getPaypalBaseUrl(): string {
  const mode = process.env.PAYPAL_MODE?.toLowerCase() === 'live' ? 'live' : 'sandbox'
  return mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
}

async function getPaypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured.')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to get PayPal access token: ${body}`)
  }

  const data = await response.json()
  return data.access_token as string
}

function headerOrEmpty(req: Request, key: string): string {
  return req.headers.get(key) ?? ''
}

export async function POST(req: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    return NextResponse.json({ error: 'PAYPAL_WEBHOOK_ID is not configured.' }, { status: 500 })
  }

  const rawBody = await req.text()
  let event: any

  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook JSON payload.' }, { status: 400 })
  }

  const transmissionId = headerOrEmpty(req, 'paypal-transmission-id')
  const transmissionTime = headerOrEmpty(req, 'paypal-transmission-time')
  const certUrl = headerOrEmpty(req, 'paypal-cert-url')
  const authAlgo = headerOrEmpty(req, 'paypal-auth-algo')
  const transmissionSig = headerOrEmpty(req, 'paypal-transmission-sig')

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    return NextResponse.json({ error: 'Missing PayPal verification headers.' }, { status: 400 })
  }

  const accessToken = await getPaypalAccessToken()
  const verifyResponse = await fetch(`${getPaypalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: event,
    }),
    cache: 'no-store',
  })

  if (!verifyResponse.ok) {
    const body = await verifyResponse.text()
    return NextResponse.json(
      { error: 'Failed to verify PayPal webhook signature.', details: body },
      { status: 502 }
    )
  }

  const verifyPayload = await verifyResponse.json()
  if (verifyPayload.verification_status !== 'SUCCESS') {
    return NextResponse.json({ error: 'Invalid PayPal webhook signature.' }, { status: 401 })
  }

  const eventType = String(event.event_type ?? '')
  const invoiceId = String(event.resource?.custom_id ?? event.resource?.invoice_id ?? '').trim()
  const amount = Number(event.resource?.amount?.value ?? 0)

  const isPaidEvent =
    eventType === 'PAYMENT.CAPTURE.COMPLETED' ||
    eventType === 'CHECKOUT.ORDER.APPROVED' ||
    eventType === 'CHECKOUT.ORDER.COMPLETED'

  // Persist this state transition in your database keyed by invoiceId.
  return NextResponse.json({
    provider: 'paypal',
    verified: true,
    eventType,
    invoiceId,
    paidAmount: amount,
    nextStatus: isPaidEvent ? 'work_in_progress' : 'reviewed_awaiting_payment',
    message: isPaidEvent
      ? 'Payment verified. Unlock order for writer execution.'
      : 'Webhook received and verified. No unlock action taken.',
  })
}
