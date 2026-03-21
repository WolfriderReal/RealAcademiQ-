import { NextResponse } from 'next/server'
import { createTestimonialReview, listTestimonialReviews } from '@/lib/testimonialStore'
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit'
import { getRequestId, logError, logInfo } from '@/lib/observability'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const requestId = getRequestId(req)
  const ip = getClientIp(req)
  const limit = enforceRateLimit({
    key: `testimonials:list:${ip}`,
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
    const reviews = await listTestimonialReviews()
    return NextResponse.json(
      { success: true, reviews },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Request-Id': requestId,
        },
      }
    )
  } catch (error) {
    logError('/api/testimonials', 'list_failed', error, { requestId, ip })
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500, headers: { 'X-Request-Id': requestId } })
  }
}

export async function POST(req: Request) {
  const requestId = getRequestId(req)
  const ip = getClientIp(req)
  const limit = enforceRateLimit({
    key: `testimonials:create:${ip}`,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many review submissions. Please try again later.' },
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
    const body = await req.json()
    const name = String(body.name || '').trim().slice(0, 60)
    const feedback = String(body.feedback || '').trim().slice(0, 600)
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5))
    const id = body.id ? String(body.id).trim().slice(0, 120) : undefined
    const createdAt = body.createdAt ? String(body.createdAt).trim().slice(0, 60) : undefined

    if (!name || !feedback) {
      return NextResponse.json({ error: 'name and feedback are required' }, { status: 400, headers: { 'X-Request-Id': requestId } })
    }

    const review = await createTestimonialReview({
      name,
      feedback,
      rating,
      id,
      createdAt,
    })

    logInfo('/api/testimonials', 'review_created', { requestId, ip, reviewId: review.id })
    return NextResponse.json({ success: true, review }, { status: 201, headers: { 'X-Request-Id': requestId } })
  } catch (error) {
    logError('/api/testimonials', 'create_failed', error, { requestId, ip })
    return NextResponse.json({ error: 'Failed to save testimonial review' }, { status: 500, headers: { 'X-Request-Id': requestId } })
  }
}
