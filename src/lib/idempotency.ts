const seenEvents = new Map<string, number>()

function cleanup(now: number) {
  for (const [key, expiresAt] of seenEvents.entries()) {
    if (expiresAt <= now) {
      seenEvents.delete(key)
    }
  }
}

export function isDuplicateEvent(scope: string, eventKey: string, ttlMs = 24 * 60 * 60 * 1000): boolean {
  const normalized = `${scope}:${eventKey}`
  const now = Date.now()
  cleanup(now)

  const existing = seenEvents.get(normalized)
  if (existing && existing > now) {
    return true
  }

  seenEvents.set(normalized, now + ttlMs)
  return false
}
