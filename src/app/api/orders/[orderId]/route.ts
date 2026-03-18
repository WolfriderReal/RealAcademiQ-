import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/orderStore'

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
        order,
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
