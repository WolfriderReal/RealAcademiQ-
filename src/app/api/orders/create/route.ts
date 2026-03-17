import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
const ordersDatabase = new Map<string, any>()

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

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !topic || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique Order ID
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const orderId = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${random}`

    // Create order object
    const order = {
      id: orderId,
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
      finalPrice: estimatedPrice * 1.1, // Add 10% tax
      status: 'pending_review',
      paymentStatus: 'pending',
      totalPaid: 0,
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store in mock database
    ordersDatabase.set(orderId, order)

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        orderId,
        order,
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
