import { NextResponse } from 'next/server'
import { listTestimonialReplies } from '@/lib/testimonialStore'
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit'
import { getRequestId, logError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const requestId = getRequestId(req)
  const ip = getClientIp(req)
  const limit = enforceRateLimit({
    key: `testimonials:replies:${ip}`,
    limit: 120,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
          'X-Request-Id': requestId,
        },
      }
    )
  }

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
          'X-Request-Id': requestId,
        },
      }
    )
  } catch (error) {
    logError('/api/testimonials/replies', 'list_failed', error, { requestId, ip })
    return NextResponse.json(
      { error: 'Failed to fetch testimonial replies' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}
