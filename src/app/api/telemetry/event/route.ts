import { NextResponse } from 'next/server'
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit'
import { getRequestId, logInfo, logError } from '@/lib/observability'

export async function POST(req: Request) {
  const requestId = getRequestId(req)
  const ip = getClientIp(req)
  const limit = enforceRateLimit({
    key: `telemetry:${ip}`,
    limit: 120,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many events. Try again later.' },
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
    const payload = await req.json()
    const eventName = String(payload?.eventName ?? '').trim()
    if (!eventName) {
      return NextResponse.json(
        { error: 'eventName is required' },
        { status: 400, headers: { 'X-Request-Id': requestId } }
      )
    }

    logInfo('/api/telemetry/event', 'event_received', {
      requestId,
      ip,
      eventName,
      pathname: payload?.pathname,
      metadata: payload?.metadata ?? {},
      occurredAt: payload?.occurredAt,
    })

    return NextResponse.json({ success: true }, { status: 202, headers: { 'X-Request-Id': requestId } })
  } catch (error) {
    logError('/api/telemetry/event', 'event_parse_failed', error, { requestId, ip })
    return NextResponse.json({ error: 'Invalid telemetry payload.' }, { status: 400, headers: { 'X-Request-Id': requestId } })
  }
}
