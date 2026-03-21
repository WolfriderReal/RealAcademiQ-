export function getRequestId(req: Request): string {
  return req.headers.get('x-request-id') ?? crypto.randomUUID()
}

export function logInfo(route: string, event: string, data: Record<string, unknown> = {}) {
  console.info(
    JSON.stringify({
      level: 'info',
      route,
      event,
      ...data,
      timestamp: new Date().toISOString(),
    })
  )
}

export function logError(
  route: string,
  event: string,
  error: unknown,
  data: Record<string, unknown> = {}
) {
  const message = error instanceof Error ? error.message : String(error)

  console.error(
    JSON.stringify({
      level: 'error',
      route,
      event,
      message,
      ...data,
      timestamp: new Date().toISOString(),
    })
  )
}
