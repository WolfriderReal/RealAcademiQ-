import { NextResponse } from 'next/server'
import { listTestimonialReplies } from '@/lib/testimonialStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const replies = await listTestimonialReplies()

    return NextResponse.json(
      {
        success: true,
        replies,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch testimonial replies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial replies' },
      { status: 500 }
    )
  }
}
