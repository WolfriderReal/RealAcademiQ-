import { NextRequest, NextResponse } from 'next/server'
import { appendAdminReply } from '@/lib/orderStore'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = decodeURIComponent(params.orderId)
    const body = await request.json()

    const adminName = String(body.adminName || '').trim().slice(0, 80)
    const message = String(body.message || '').trim().slice(0, 1200)

    if (!adminName || !message) {
      return NextResponse.json(
        { error: 'Admin name and message are required' },
        { status: 400 }
      )
    }

    const updatedOrder = await appendAdminReply({
      orderId,
      adminName,
      message,
    })

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Admin reply error:', error)
    return NextResponse.json(
      { error: 'Failed to add admin reply' },
      { status: 500 }
    )
  }
}
