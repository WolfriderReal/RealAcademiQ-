import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/orderStore'

export async function POST(request: NextRequest) {
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
        { status: 400 }
      )
    }

    if (!Number.isFinite(numericEstimatedPrice) || numericEstimatedPrice <= 0) {
      return NextResponse.json(
        { error: 'Please provide a valid proposed price.' },
        { status: 400 }
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

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully. Final price will be confirmed after review.',
        orderId: order.id,
        orderNumber: order.id,
        trackingToken: order.trackingToken,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
