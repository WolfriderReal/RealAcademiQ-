import { NextResponse } from 'next/server'
import { assertPositiveAmount, normalizeKenyanPhone } from '@/lib/paymentWorkflow'

type MpesaStkPayload = {
  invoiceId?: string
  amount?: number
  phoneNumber?: string
}

function mpesaBaseUrl(): string {
  return process.env.MPESA_ENV?.toLowerCase() === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}

function timestamp() {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(
    d.getMinutes()
  )}${pad(d.getSeconds())}`
}

async function getMpesaAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY
  const secret = process.env.MPESA_CONSUMER_SECRET

  if (!key || !secret) {
    throw new Error('M-Pesa consumer key/secret are not configured.')
  }

  const basic = Buffer.from(`${key}:${secret}`).toString('base64')
  const response = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${basic}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to get M-Pesa access token: ${body}`)
  }

  const payload = await response.json()
  return payload.access_token as string
}

export async function POST(req: Request) {
  let payload: MpesaStkPayload

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

  const phoneRaw = String(payload.phoneNumber ?? '').trim()
  let phoneNumber: string

  try {
    phoneNumber = normalizeKenyanPhone(phoneRaw)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  const callbackUrl = process.env.MPESA_CALLBACK_URL

  if (!shortcode || !passkey || !callbackUrl) {
    return NextResponse.json(
      { error: 'MPESA_SHORTCODE, MPESA_PASSKEY, and MPESA_CALLBACK_URL are required.' },
      { status: 500 }
    )
  }

  const ts = timestamp()
  const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64')
  const accessToken = await getMpesaAccessToken()
  const callbackUrlWithInvoice = callbackUrl.includes('?')
    ? `${callbackUrl}&invoiceId=${encodeURIComponent(invoiceId)}`
    : `${callbackUrl}?invoiceId=${encodeURIComponent(invoiceId)}`

  // The account number where the paybill payment should be routed
  const accountNumber = process.env.MPESA_ACCOUNT_NUMBER || '440005939461'

  const response = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrlWithInvoice,
      AccountReference: accountNumber,
      TransactionDesc: `Order ${invoiceId}`,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    return NextResponse.json({ error: 'STK push request failed.', details: body }, { status: 502 })
  }

  const data = await response.json()

  // Safaricom returns ResponseCode '0' for success; anything else is a failure
  if (data.ResponseCode !== '0' && data.ResponseCode !== 0) {
    return NextResponse.json(
      { error: data.ResponseDescription || data.errorMessage || 'STK push was rejected by Safaricom.' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    provider: 'mpesa',
    invoiceId,
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    responseCode: data.ResponseCode,
    responseDescription: data.ResponseDescription,
    customerMessage: data.CustomerMessage,
    statusHint: 'awaiting_payment_confirmation',
  })
}
