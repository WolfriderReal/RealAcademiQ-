type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export function enforceRateLimit(input: {
  key: string
  limit: number
  windowMs: number
}): { ok: true; remaining: number } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now()
  const current = buckets.get(input.key)

  if (!current || now >= current.resetAt) {
    buckets.set(input.key, {
      count: 1,
      resetAt: now + input.windowMs,
    })
    return { ok: true, remaining: input.limit - 1 }
  }

  if (current.count >= input.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    return { ok: false, retryAfterSeconds }
  }

  current.count += 1
  buckets.set(input.key, current)
  return { ok: true, remaining: input.limit - current.count }
}
