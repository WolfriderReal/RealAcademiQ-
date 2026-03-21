import { NextResponse } from 'next/server'
import { isDuplicateEvent } from '@/lib/idempotency'
import { getRequestId, logError, logInfo } from '@/lib/observability'

type CallbackItem = {
  Name: string
  Value?: string | number
}

function findItem(items: CallbackItem[], name: string): CallbackItem | undefined {
  return items.find((item) => item.Name === name)
}

export async function POST(req: Request) {
  const requestId = getRequestId(req)
  const callbackUrl = new URL(req.url)
  const invoiceFromQuery = callbackUrl.searchParams.get('invoiceId') ?? ''

  const callbackSecret = process.env.MPESA_CALLBACK_SECRET
  if (callbackSecret) {
    const incoming = req.headers.get('x-callback-secret')
    if (incoming !== callbackSecret) {
      return NextResponse.json({ error: 'Unauthorized callback request.' }, { status: 401, headers: { 'X-Request-Id': requestId } })
    }
  }

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid callback payload.' }, { status: 400, headers: { 'X-Request-Id': requestId } })
  }

  const callback = payload?.Body?.stkCallback
  if (!callback) {
    return NextResponse.json({ error: 'Missing Body.stkCallback in callback payload.' }, { status: 400, headers: { 'X-Request-Id': requestId } })
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

  const dedupeKey = `${checkoutRequestId}:${mpesaReceipt || resultCode}`
  if (checkoutRequestId && isDuplicateEvent('mpesa_callback', dedupeKey)) {
    return NextResponse.json(
      {
        provider: 'mpesa',
        acknowledged: true,
        duplicate: true,
        checkoutRequestId,
      },
      { headers: { 'X-Request-Id': requestId } }
    )
  }

  const success = resultCode === 0

  logInfo('/api/payments/mpesa/callback', 'callback_received', {
    requestId,
    success,
    resultCode,
    invoiceId,
    checkoutRequestId,
    mpesaReceipt,
  })

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
  }, { headers: { 'X-Request-Id': requestId } })
}
