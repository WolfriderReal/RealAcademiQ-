import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get()
    
    const orders = snapshot.docs.map((doc) => doc.data())

    return NextResponse.json(
      {
        success: true,
        orders,
        total: orders.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: String(error) },
      { status: 500 }
    )
  }
}
