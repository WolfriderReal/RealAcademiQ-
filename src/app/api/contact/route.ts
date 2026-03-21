import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit'
import { getRequestId, logError, logInfo } from '@/lib/observability'

const MAX_REQUESTS_PER_HOUR = 20
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitizeInput(value: string): string {
  return value.trim().replace(/<[^>]*>/g, '')
}

export async function POST(req: Request) {
  const requestId = getRequestId(req)
  const ip = getClientIp(req)

  const limit = enforceRateLimit({
    key: `contact:${ip}`,
    limit: MAX_REQUESTS_PER_HOUR,
    windowMs: RATE_LIMIT_WINDOW_MS,
  })

  if (!limit.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests, please try again later.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(limit.retryAfterSeconds),
        'X-Request-Id': requestId,
      },
    })
  }

  let payload: any
  try {
    payload = await req.json()
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }

  const name = sanitizeInput(String(payload.name ?? ''))
  const email = sanitizeInput(String(payload.email ?? ''))
  const subject = sanitizeInput(String(payload.subject ?? 'New contact message'))
  const message = sanitizeInput(String(payload.message ?? ''))

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }

  if (name.length > 100 || subject.length > 150 || message.length > 5000) {
    return new Response(JSON.stringify({ error: 'One or more fields exceed the allowed length.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }

  // CONTACT_EMAIL must be set as a server-side environment variable (never use NEXT_PUBLIC_ for secrets).
  const recipient = process.env.CONTACT_EMAIL
  const resendApiKey = process.env.RESEND_API_KEY
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!recipient) {
    console.warn(
      'CONTACT_EMAIL is not configured. Set CONTACT_EMAIL in .env.local or in your deployment environment secrets.'
    )
    return new Response(JSON.stringify({ error: 'Recipient email is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }

  const fromAddress = process.env.EMAIL_FROM ?? process.env.RESEND_FROM ?? smtpUser
  const emailSubject = `New Contact Request: ${subject}`
  const emailText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  const emailHtml = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `

  // Prefer Resend when configured because it avoids SMTP auth issues from some providers.
  if (resendApiKey && fromAddress) {
    try {
      const resend = new Resend(resendApiKey)
      const result = await resend.emails.send({
        from: fromAddress,
        to: [recipient],
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        replyTo: email,
      })

      if (!result.error) {
        logInfo('/api/contact', 'message_forwarded_resend', { requestId, ip })
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
        })
      }

      logError('/api/contact', 'resend_send_failed', result.error, { requestId, ip })
      // Continue to SMTP fallback below if available.
    } catch (error: any) {
      logError('/api/contact', 'resend_send_threw', error, { requestId, ip })
      // Continue to SMTP fallback below if available.
    }
  }

  if (!smtpHost || !smtpUser || !smtpPass || !fromAddress) {
    console.warn(
      'Email settings are incomplete. Set RESEND_API_KEY/RESEND_FROM or SMTP_HOST/SMTP_USER/SMTP_PASS in .env.local.'
    )
    return new Response(JSON.stringify({ error: 'Email configuration is incomplete.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      replyTo: email,
    })

    logInfo('/api/contact', 'message_forwarded_smtp', { requestId, ip })
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  } catch (error: any) {
    logError('/api/contact', 'smtp_send_failed', error, { requestId, ip })
    return new Response(JSON.stringify({ error: 'Failed to send message. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    })
  }
}
