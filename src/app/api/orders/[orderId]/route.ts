import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
const mockOrders: Record<string, any> = {
  'ORD-20250317-ABC123': {
    id: 'ORD-20250317-ABC123',
    customerName: 'John Doe',
    topic: 'The Impact of Artificial Intelligence on Modern Education',
    serviceType: 'assignment',
    status: 'work_in_progress',
    createdAt: '2025-03-10T10:00:00Z',
    deadline: '2025-03-25',
    totalPrice: 165.00,
    totalPaid: 100.00,
    paymentStatus: 'partial',
    currentPhase: 3,
    phases: [
      {
        phase: 1,
        name: 'Order Initiation',
        completed: true,
        completedAt: '2025-03-10T10:30:00Z',
        description: 'Your order has been submitted and received.'
      },
      {
        phase: 2,
        name: 'Assessment & Pricing',
        completed: true,
        completedAt: '2025-03-10T14:00:00Z',
        description: 'Our team reviewed your requirements and confirmed pricing.'
      },
      {
        phase: 3,
        name: 'Payment Processing',
        completed: false,
        description: 'Partial payment received. Waiting for final payment confirmation.'
      },
      {
        phase: 4,
        name: 'Work in Progress',
        completed: false,
        description: 'Your assigned writer is working on your assignment.'
      },
      {
        phase: 5,
        name: 'Delivery & Download',
        completed: false,
        description: 'Your completed work will be ready for download.'
      }
    ],
    notes: 'Your assignment is progressing well. We expect to have the first draft ready within 2 days for your review.',
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = decodeURIComponent(params.orderId)

    // Check if order exists in mock database
    const order = mockOrders[orderId]

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
