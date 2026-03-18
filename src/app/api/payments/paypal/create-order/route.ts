import { NextResponse } from 'next/server'
import { assertPositiveAmount, normalizeCurrency } from '@/lib/paymentWorkflow'

type PaypalCreateOrderPayload = {
  invoiceId?: string
  amount?: number
  currency?: string
  returnUrl?: string
  cancelUrl?: string
}

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

export async function POST(req: Request) {
  let payload: PaypalCreateOrderPayload

  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const invoiceId = String(payload.invoiceId ?? '').trim()
  if (!invoiceId) {
    return NextResponse.json({ error: 'invoiceId is required.' }, { status: 400 })
  }

  let amount: number
  try {
    amount = assertPositiveAmount(payload.amount)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const accessToken = await getPaypalAccessToken()
  const currencyCode = normalizeCurrency(payload.currency, 'USD')
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const paypalResponse = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          invoice_id: invoiceId,
          custom_id: invoiceId,
          amount: {
            currency_code: currencyCode,
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: payload.returnUrl ?? `${appBaseUrl}/services`,
        cancel_url: payload.cancelUrl ?? `${appBaseUrl}/services`,
        user_action: 'PAY_NOW',
      },
    }),
    cache: 'no-store',
  })

  if (!paypalResponse.ok) {
    await paypalResponse.text()
    return NextResponse.json(
      { error: 'Failed to create PayPal order.' },
      { status: 502 }
    )
  }

  const order = await paypalResponse.json()
  const approveUrl = Array.isArray(order.links)
    ? order.links.find((link: any) => link.rel === 'approve')?.href
    : null

  return NextResponse.json({
    provider: 'paypal',
    orderId: order.id,
    invoiceId,
    statusHint: 'awaiting_payment_confirmation',
    approveUrl,
  })
}
