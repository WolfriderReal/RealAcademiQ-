import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/orderStore'
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit'
import { getRequestId, logError } from '@/lib/observability'

function toPublicOrderView(order: any) {
  return {
    id: order.id,
    serviceType: order.serviceType,
    deadline: order.deadline,
    status: order.status,
    paymentStatus: order.paymentStatus,
    currentPhase: order.currentPhase,
    phases: order.phases,
    adminReplies: order.adminReplies || [],
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const requestId = getRequestId(request)
  const ip = getClientIp(request)
  const limit = enforceRateLimit({
    key: `orders:track:${ip}`,
    limit: 120,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many tracking requests. Please try again later.' },
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
    const orderId = decodeURIComponent(params.orderId)
    const token = request.nextUrl.searchParams.get('token')?.trim()

    if (!token) {
      return NextResponse.json({ error: 'Tracking token is required' }, { status: 401, headers: { 'X-Request-Id': requestId } })
    }

    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404, headers: { 'X-Request-Id': requestId } }
      )
    }

    if (order.trackingToken !== token) {
      return NextResponse.json({ error: 'Invalid tracking token' }, { status: 401, headers: { 'X-Request-Id': requestId } })
    }

    return NextResponse.json(
      {
        success: true,
        order: toPublicOrderView(order),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Request-Id': requestId,
        },
      }
    )
  } catch (error) {
    logError('/api/orders/[orderId]', 'fetch_failed', error, { requestId, ip })
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}
