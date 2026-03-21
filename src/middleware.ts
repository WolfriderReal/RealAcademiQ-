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

function decodeBasicAuth(encoded: string): string {
  try {
    return Buffer.from(encoded, 'base64').toString('utf8')
  } catch {
    return ''
  }
}

function secureEquals(left: string, right: string): boolean {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i)
  }

  return mismatch === 0
}

export function middleware(req: NextRequest) {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD?.trim()

  // Keep admin surfaces closed if credentials are not configured.
  if (!username || !password) {
    return new NextResponse('Admin access is not configured.', { status: 503 })
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  const decoded = decodeBasicAuth(authHeader.slice(6))
  const separator = decoded.indexOf(':')
  const incomingUser = separator >= 0 ? decoded.slice(0, separator).trim() : ''
  const incomingPass = separator >= 0 ? decoded.slice(separator + 1).trim() : ''

  if (!secureEquals(incomingUser, username) || !secureEquals(incomingPass, password)) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
