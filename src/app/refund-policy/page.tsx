import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Refund & Cancellation Policy' }

export default function RefundPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-14 text-slate-700">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Customer policy · Effective 12 November 2026</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Refund & cancellation policy</h1>
      <p className="mt-5 text-lg">Please read this before paying. We confirm the agreed scope, final price, deadline, and any order-specific conditions with you in writing before you pay. Do not pay if those details are unclear or you do not agree.</p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Cancel before work starts</h2>
        <p>You may ask to cancel at any time. If you cancel before work has started, we will refund the amount paid for the order. We will tell you promptly if work has already started and explain what work has been completed.</p>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Cancel after work starts</h2>
        <p>If you cancel after work has started but before delivery, we will review the work completed and refund the unused portion of the amount paid. Before processing, we will give you an itemized explanation of any amount retained for work already completed. We will not charge more than the agreed order price.</p>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Problems with delivered work</h2>
        <p>If the delivered service materially differs from the scope we confirmed in writing, contact us with the issue. We will review it and, where appropriate, offer a correction or a fair refund for the affected portion. This policy does not limit rights that cannot be excluded under applicable law.</p>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">How to request a cancellation or refund</h2>
        <p>Contact us through our <Link className="text-emerald-800 underline" href="/contact">Contact page</Link> or <a className="text-emerald-800 underline" href="https://wa.me/254101582198" target="_blank" rel="noopener noreferrer">WhatsApp support</a>. Include your order ID and the email or phone number used for the order. We will confirm the decision and refund amount in writing. Refunds are sent using an agreed method; processing time may depend on the payment provider.</p>
        <p>Do not send payment until you have received and accepted a written final quote. If a payment provider deducts a fee that cannot be recovered, we will explain any proposed deduction before processing a refund; we will not apply an undisclosed fee.</p>
      </section>
      <p className="mt-10 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">This policy describes the customer commitments proposed for RealAcademiQ. The business should verify that its team can consistently honor these refund terms before accepting payments.</p>
    </article>
  )
}
