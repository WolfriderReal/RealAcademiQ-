# RealAcademiQ-

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with the following variables:

```env
# Required: destination email where contact form messages should be delivered
CONTACT_EMAIL=your_contact_email@example.com

# Recommended: Resend API (avoids SMTP auth issues)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM=RealAcademiQ <onboarding@resend.dev>

# Alternative: SMTP settings
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username@example.com
SMTP_PASS=your_smtp_password

# Optional: override the "from" address for outgoing mail
# EMAIL_FROM=RealAcademiQ <no-reply@example.com>
```

3. Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000 to view the site.

## Payment Callback Wiring (PayPal + M-Pesa)

The project now includes API route scaffolding for invoice payment initiation and callback verification:

- `POST /api/payments/paypal/create-order`
- `POST /api/payments/paypal/webhook`
- `POST /api/payments/mpesa/stk-push`
- `POST /api/payments/mpesa/callback`

### Required Environment Variables

Add these to `.env.local` (or your deployment secrets manager):

```env
# Public app URL used for PayPal return/cancel fallbacks
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_WEBHOOK_ID=your-paypal-webhook-id

# M-Pesa Daraja
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-mpesa-passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/mpesa/callback

# Optional extra protection for callback endpoint (custom header x-callback-secret)
# MPESA_CALLBACK_SECRET=your-random-shared-secret
```

### Important Integration Note

These routes intentionally return normalized payment events and status hints. To make the flow production-ready, persist all payment attempts and callbacks in your database, enforce idempotency by provider transaction IDs, and then apply status transitions to your `orders` table.
