import { listTestimonialReplies } from '@/lib/testimonialStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const encoder = new TextEncoder()

function encodeSse(payload: unknown) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
}

function encodePing() {
  return encoder.encode(': ping\n\n')
}

export async function GET(req: Request) {
  let updateInterval: ReturnType<typeof setInterval> | null = null
  let pingInterval: ReturnType<typeof setInterval> | null = null

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false
      let lastFingerprint = ''

      const safeClose = () => {
        if (closed) return
        closed = true
        if (updateInterval) {
          clearInterval(updateInterval)
          updateInterval = null
        }
        if (pingInterval) {
          clearInterval(pingInterval)
          pingInterval = null
        }

        try {
          controller.close()
        } catch {
          // Ignore close failures caused by already-closed streams.
        }
      }

      const pushIfChanged = async () => {
        try {
          const replies = await listTestimonialReplies()
          const fingerprint = replies.map((reply) => `${reply.id}:${reply.createdAt}`).join('|')

          if (fingerprint !== lastFingerprint) {
            lastFingerprint = fingerprint
            controller.enqueue(encodeSse({ replies }))
          }
        } catch {
          // Keep stream alive even if one read fails.
        }
      }

      await pushIfChanged()

      updateInterval = setInterval(() => {
        void pushIfChanged()
      }, 1000)

      pingInterval = setInterval(() => {
        controller.enqueue(encodePing())
      }, 15000)

      req.signal.addEventListener('abort', safeClose)
    },
    cancel() {
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
      if (pingInterval) {
        clearInterval(pingInterval)
        pingInterval = null
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
