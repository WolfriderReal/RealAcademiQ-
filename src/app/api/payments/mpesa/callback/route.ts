import { NextResponse } from 'next/server'

type CallbackItem = {
  Name: string
  Value?: string | number
}

function findItem(items: CallbackItem[], name: string): CallbackItem | undefined {
  return items.find((item) => item.Name === name)
}

export async function POST(req: Request) {
  const callbackUrl = new URL(req.url)
  const invoiceFromQuery = callbackUrl.searchParams.get('invoiceId') ?? ''

  const callbackSecret = process.env.MPESA_CALLBACK_SECRET
  if (callbackSecret) {
    const incoming = req.headers.get('x-callback-secret')
    if (incoming !== callbackSecret) {
      return NextResponse.json({ error: 'Unauthorized callback request.' }, { status: 401 })
    }
  }

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid callback payload.' }, { status: 400 })
  }

  const callback = payload?.Body?.stkCallback
  if (!callback) {
    return NextResponse.json({ error: 'Missing Body.stkCallback in callback payload.' }, { status: 400 })
  }

  const resultCode = Number(callback.ResultCode)
  const resultDesc = String(callback.ResultDesc ?? '')
  const merchantRequestId = String(callback.MerchantRequestID ?? '')
  const checkoutRequestId = String(callback.CheckoutRequestID ?? '')
  const metadataItems: CallbackItem[] = callback.CallbackMetadata?.Item ?? []

  const amount = Number(findItem(metadataItems, 'Amount')?.Value ?? 0)
  const mpesaReceipt = String(findItem(metadataItems, 'MpesaReceiptNumber')?.Value ?? '')
  const phoneNumber = String(findItem(metadataItems, 'PhoneNumber')?.Value ?? '')
  const invoiceId = String(findItem(metadataItems, 'AccountReference')?.Value ?? invoiceFromQuery).trim()

  const success = resultCode === 0

  // Persist callback details + receipt idempotency in your database keyed by checkoutRequestId/mpesaReceipt.
  return NextResponse.json({
    provider: 'mpesa',
    acknowledged: true,
    success,
    nextStatus: success ? 'work_in_progress' : 'reviewed_awaiting_payment',
    resultCode,
    resultDesc,
    invoiceId,
    amount,
    phoneNumber,
    mpesaReceipt,
    merchantRequestId,
    checkoutRequestId,
  })
}
