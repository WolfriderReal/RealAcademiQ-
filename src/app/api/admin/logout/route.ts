import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('Logged out. You can close this tab or go back to the homepage.', {
    status: 401,
    headers: {
      // A dedicated realm prompts the browser to drop/re-challenge cached admin credentials.
      'WWW-Authenticate': 'Basic realm="Logged Out"',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}