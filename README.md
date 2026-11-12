# RealAcademiQ-

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with the variables needed by your deployment. For contact email delivery, configure `CONTACT_EMAIL` and either Resend or SMTP credentials.

3. Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000 to view the site.

## Payments

The order flow supports M-Pesa STK Push and manual M-Pesa Paybill. Configure the M-Pesa Daraja credentials in your deployment environment:

```env
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-mpesa-passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/mpesa/callback
# Optional extra protection for callback endpoint (custom header x-callback-secret)
# MPESA_CALLBACK_SECRET=your-random-shared-secret
```

PayPal checkout and webhook endpoints have been retired. Existing requests to those endpoints return HTTP 410 Gone.
