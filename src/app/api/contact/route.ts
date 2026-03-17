import nodemailer from 'nodemailer'
import { Resend } from 'resend'

const MAX_REQUESTS_PER_HOUR = 20
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const DEFAULT_CONTACT_EMAIL = 'kstrategic_inc@outlook.com'

const rateLimitStore = new Map<string, { count: number; firstRequestAt: number }>()

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitizeInput(value: string): string {
  return value.trim().replace(/<[^>]*>/g, '')
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const now = Date.now()

  const existing = rateLimitStore.get(ip)
  if (existing) {
    if (now - existing.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.set(ip, { count: 1, firstRequestAt: now })
    } else if (existing.count >= MAX_REQUESTS_PER_HOUR) {
      return new Response(JSON.stringify({ error: 'Too many requests, please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      existing.count += 1
      rateLimitStore.set(ip, existing)
    }
  } else {
    rateLimitStore.set(ip, { count: 1, firstRequestAt: now })
  }

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const name = sanitizeInput(String(payload.name ?? ''))
  const email = sanitizeInput(String(payload.email ?? ''))
  const subject = sanitizeInput(String(payload.subject ?? 'New contact message'))
  const message = sanitizeInput(String(payload.message ?? ''))

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (name.length > 100 || subject.length > 150 || message.length > 5000) {
    return new Response(JSON.stringify({ error: 'One or more fields exceed the allowed length.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const recipient =
    process.env.CONTACT_EMAIL ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? DEFAULT_CONTACT_EMAIL
  const resendApiKey = process.env.RESEND_API_KEY
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!isValidEmail(recipient)) {
    return new Response(JSON.stringify({ error: 'Recipient email is invalid.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      console.error('Resend email send failed:', result.error)
      // Continue to SMTP fallback below if available.
    } catch (error: any) {
      console.error('Resend email send threw an error:', error)
      // Continue to SMTP fallback below if available.
    }
  }

  if (!smtpHost || !smtpUser || !smtpPass || !fromAddress) {
    console.warn(
      'Email settings are incomplete. Set RESEND_API_KEY/RESEND_FROM or SMTP_HOST/SMTP_USER/SMTP_PASS in .env.local.'
    )
    return new Response(JSON.stringify({ error: 'Email configuration is incomplete.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Contact form email send failed:', error)
    return new Response(JSON.stringify({ error: 'Failed to send message. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
