import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/orderStore'
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit'
import { getRequestId, logError, logInfo } from '@/lib/observability'

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request)
  const ip = getClientIp(request)
  const limit = enforceRateLimit({
    key: `orders:create:${ip}`,
    limit: 15,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many order requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
          'X-Request-Id': requestId,
        },
      }
    )
  }

  try {
    const body = await request.json()
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      topic,
      description,
      pageCount,
      deadline,
      formatStyle,
      estimatedPrice,
    } = body

    const numericEstimatedPrice = Number(estimatedPrice)

    // Validate required fields
    if (!customerName || !customerEmail || !topic || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: { 'X-Request-Id': requestId } }
      )
    }

    if (!Number.isFinite(numericEstimatedPrice) || numericEstimatedPrice <= 0) {
      return NextResponse.json(
        { error: 'Please provide a valid proposed price.' },
        { status: 400, headers: { 'X-Request-Id': requestId } }
      )
    }

    const order = await createOrder({
      customerName,
      customerEmail,
      customerPhone: String(customerPhone ?? '').trim(),
      serviceType,
      topic,
      description,
      pageCount: Number(pageCount) || 1,
      deadline,
      formatStyle,
      estimatedPrice: numericEstimatedPrice,
    })

    logInfo('/api/orders/create', 'order_created', {
      requestId,
      ip,
      orderId: order.id,
      serviceType,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully. Final price will be confirmed after review.',
        orderId: order.id,
        orderNumber: order.id,
        trackingToken: order.trackingToken,
      },
      { status: 201, headers: { 'X-Request-Id': requestId } }
    )
  } catch (error) {
    logError('/api/orders/create', 'order_create_failed', error, { requestId, ip })
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}
