export async function trackClientEvent(
  eventName: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === 'undefined') return

  const payload = JSON.stringify({
    eventName,
    metadata,
    pathname: window.location.pathname,
    occurredAt: new Date().toISOString(),
  })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/telemetry/event', blob)
      return
    }

    await fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
      cache: 'no-store',
    })
  } catch {
    // Telemetry is best-effort and should never block user actions.
  }
}
