import { NextRequest, NextResponse } from 'next/server'

function unauthorizedResponse(): NextResponse {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
      'Cache-Control': 'no-store',
    },
  })
}

export function middleware(req: NextRequest) {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  // Keep admin surfaces closed if credentials are not configured.
  if (!username || !password) {
    return new NextResponse('Admin access is not configured.', { status: 503 })
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8')
  const separator = decoded.indexOf(':')
  const incomingUser = separator >= 0 ? decoded.slice(0, separator) : ''
  const incomingPass = separator >= 0 ? decoded.slice(separator + 1) : ''

  if (incomingUser !== username || incomingPass !== password) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
