import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-14 text-slate-700">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Customer terms · Effective 12 November 2026</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Terms of service</h1>
      <p className="mt-5 text-lg">These terms explain how requests, quotes, and payments work on RealAcademiQ. If a specific written order confirmation conflicts with a general description here, ask us to clarify before paying.</p>

      <section className="mt-10 space-y-4"><h2 className="text-2xl font-semibold text-slate-900">Requests, quotes, and acceptance</h2><p>Submitting a request is not a payment and does not by itself commit you to purchase. Prices shown on our <Link className="text-emerald-800 underline" href="/services">services and pricing page</Link> are indicative ranges, not a final quote. After reviewing your requirements, we will confirm the service scope, total price and currency, deadline, deliverables, and any relevant conditions in writing. An order is accepted only when you agree to that written confirmation. Do not pay until you have it.</p><p>If we cannot meet an agreed deadline or scope, we will contact you to agree on a change or cancellation; we will not treat an unapproved change as accepted.</p></section>
      <section className="mt-8 space-y-4"><h2 className="text-2xl font-semibold text-slate-900">Payment</h2><p>Available payment instructions are shown during checkout. Check the recipient, amount, and order reference before approving a transaction. A payment prompt or screenshot is not confirmation that payment has cleared; we confirm receipt with the payment provider. Never pay an amount different from the written quote without first agreeing to the change in writing.</p></section>
      <section className="mt-8 space-y-4"><h2 className="text-2xl font-semibold text-slate-900">Your responsibilities and academic use</h2><p>Provide accurate requirements, source material, and contact details, and tell us about applicable institutional rules. Our services are for learning support, research guidance, coaching, editing, and related assistance. You are responsible for checking and following your institution's academic-integrity requirements and for how you use any guidance or materials provided.</p></section>
      <section className="mt-8 space-y-4"><h2 className="text-2xl font-semibold text-slate-900">Cancellations and service concerns</h2><p>Our <Link className="text-emerald-800 underline" href="/refund-policy">Refund & cancellation policy</Link> explains how to request cancellation or raise a concern about delivered work. These terms do not remove consumer rights that applicable law does not allow us to limit.</p></section>
      <section className="mt-8 space-y-4"><h2 className="text-2xl font-semibold text-slate-900">Contact and changes</h2><p>Contact us through the <Link className="text-emerald-800 underline" href="/contact">Contact page</Link> if you have questions. If we update these terms, we will post the revised version here with a new effective date. Terms for an already accepted order will not be changed without your agreement, except where required by law.</p></section>
      <p className="mt-10 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">These customer terms are a suggested baseline and should be checked by the business and reviewed for the laws that apply to its customers before relying on them.</p>
    </article>
  )
}
