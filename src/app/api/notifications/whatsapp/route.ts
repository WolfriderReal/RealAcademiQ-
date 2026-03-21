import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewerName, adminName, replyText, notifyAdmin, notifyClient } = body

    // Get WhatsApp credentials from environment
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_WHATSAPP_PHONE
    const adminPhoneNumber = process.env.ADMIN_WHATSAPP_PHONE
    const clientPhoneNumber = process.env.CLIENT_WHATSAPP_PHONE

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.warn('WhatsApp notification credentials not configured')
      return NextResponse.json(
        { success: true, message: 'Notifications configured for later use' },
        { status: 200 }
      )
    }

    // Send notifications
    const notifications = []

    // Notify admin
    if (notifyAdmin && adminPhoneNumber) {
      const adminMessage = `New reply on RealAcademiQ! 🎓\n\nReview by: ${reviewerName}\nReply from: ${adminName}\n\nMessage: "${replyText}"\n\nReply URL: ${process.env.NEXT_PUBLIC_APP_URL || 'https://real-academi-q.vercel.app'}/`
      notifications.push(
        sendTwilioWhatsApp(
          twilioAccountSid,
          twilioAuthToken,
          twilioPhoneNumber,
          adminPhoneNumber,
          adminMessage
        )
      )
    }

    // Notify client (if we have their phone - currently not stored, so we skip it)
    if (notifyClient && clientPhoneNumber) {
      const clientMessage = `Hi ${reviewerName}! 👋\n\n${adminName} from RealAcademiQ replied to your review:\n\n"${replyText}"\n\nThank you for using our service! 🙏`
      notifications.push(
        sendTwilioWhatsApp(
          twilioAccountSid,
          twilioAuthToken,
          twilioPhoneNumber,
          clientPhoneNumber,
          clientMessage
        )
      )
    }

    if (notifications.length > 0) {
      await Promise.all(notifications)
    }

    return NextResponse.json({ success: true, message: 'Notifications sent' })
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

async function sendTwilioWhatsApp(
  accountSid: string,
  authToken: string,
  fromNumber: string,
  toNumber: string,
  message: string
) {
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  return fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: fromNumber,
      To: toNumber,
      Body: message,
    }).toString(),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.sid) {
        console.log(`WhatsApp sent: ${data.sid}`)
        return true
      }
      throw new Error(data.message || 'Unknown error')
    })
    .catch((err) => {
      console.error('Twilio error:', err.message)
      throw err
    })
}
