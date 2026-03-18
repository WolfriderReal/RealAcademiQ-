import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/orderStore'

function toPublicOrderView(order: any) {
  return {
    id: order.id,
    serviceType: order.serviceType,
    deadline: order.deadline,
    status: order.status,
    paymentStatus: order.paymentStatus,
    currentPhase: order.currentPhase,
    phases: order.phases,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = decodeURIComponent(params.orderId)
    const token = request.nextUrl.searchParams.get('token')?.trim()

    if (!token) {
      return NextResponse.json({ error: 'Tracking token is required' }, { status: 401 })
    }

    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.trackingToken !== token) {
      return NextResponse.json({ error: 'Invalid tracking token' }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: true,
        order: toPublicOrderView(order),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch order error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
