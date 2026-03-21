import { NextRequest, NextResponse } from 'next/server'
import { createTestimonialReply } from '@/lib/testimonialStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const reviewId = String(body.reviewId || '').trim().slice(0, 120)
    const adminName = String(body.adminName || '').trim().slice(0, 80)
    const replyText = String(body.replyText || '').trim().slice(0, 1200)
    const id = body.id ? String(body.id).trim().slice(0, 120) : undefined
    const createdAt = body.createdAt ? String(body.createdAt).trim().slice(0, 60) : undefined

    if (!reviewId || !adminName || !replyText) {
      return NextResponse.json(
        { error: 'reviewId, adminName, and replyText are required' },
        { status: 400 }
      )
    }

    const reply = await createTestimonialReply({
      reviewId,
      adminName,
      replyText,
      id,
      createdAt,
    })

    return NextResponse.json(
      {
        success: true,
        reply,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to save testimonial reply:', error)
    return NextResponse.json(
      { error: 'Failed to save testimonial reply' },
      { status: 500 }
    )
  }
}
