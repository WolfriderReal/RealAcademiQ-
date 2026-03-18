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

    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
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
