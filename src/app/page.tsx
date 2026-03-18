
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Award, Users, Star, CheckCircle, ClipboardList, SearchCheck, CreditCard, FileCheck2, Download } from 'lucide-react'
import TestimonialsAndSupport from '@/components/TestimonialsAndSupport'

export default function Home() {
  const services = [
    { icon: BookOpen, title: 'Assignments', desc: 'High-quality solutions for all subjects and levels' },
    { icon: Award, title: 'Thesis', desc: 'Complete thesis writing and research assistance' },
    { icon: Users, title: 'Projects', desc: 'End-to-end project development and guidance' },
    { icon: Star, title: 'Proposals', desc: 'Compelling research proposals and grant applications' },
  ]

  const orderPhases = [
    {
      icon: ClipboardList,
      phase: 'Phase 1: Order Initiation',
      status: 'Pending Review',
      points: [
        'Client logs in and opens the order form.',
        'Client submits assignment details: topic, page count, and formatting style.',
        'Client uploads supporting documents and instructions.'
      ]
    },
    {
      icon: SearchCheck,
      phase: 'Phase 2: Assessment',
      status: 'Reviewed - Awaiting Payment',
      points: [
        'Administrator or writer reviews submitted requirements for completeness.',
        'Final pricing is confirmed based on scope and deadline.'
      ]
    },
    {
      icon: CreditCard,
      phase: 'Phase 3: Payment Processing',
      status: 'Awaiting Payment Confirmation',
      points: [
        'System generates an invoice and shows payment options to start work.',
        'Option 1: PayPal redirect for secure authorization.',
        'Option 2: M-Pesa STK Push via Safaricom phone number entered on the website.',
        'Option 3: M-Pesa Manual Paybill (Business Number: 714777, Account Number: 440005939461).'
      ]
    },
    {
      icon: FileCheck2,
      phase: 'Phase 4: Execution',
      status: 'Work in Progress',
      points: [
        'After payment receipt is verified, the order is unlocked for the writer.',
        'Writer begins and progresses the assignment based on approved requirements.'
      ]
    },
    {
      icon: Download,
      phase: 'Phase 5: Delivery and Access',
      status: 'Completed - Ready to Download',
      points: [
        'Writer uploads the final document when complete.',
        'Client can view a locked or watermarked preview.',
        'If payment was partial, client is prompted to clear the balance to unlock the full file.',
        'If payment is complete, file unlocks immediately for download.'
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              Achieve Academic
              <span className="text-amber-600"> Excellence</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Professional assistance with assignments, thesis, projects, and proposals.
              Get expert help from qualified academics and elevate your academic performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg rounded-xl">
                  Submit Your Order <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/track-order">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-xl">
                  Track Order
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-xl">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Real-Time Tracking</h3>
                <p className="text-sm text-slate-700">Monitor your order progress at every phase with instant updates</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Multiple Payment Options</h3>
                <p className="text-sm text-slate-700">Pay securely via PayPal or M-Pesa with flexible payment terms</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Secure & Confidential</h3>
                <p className="text-sm text-slate-700">Your information is encrypted and never shared with third parties</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive academic support tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="bg-slate-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Orders Work */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Your Order Progresses
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              A transparent 5-phase workflow from submission and payment to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orderPhases.map((phase) => (
              <div key={phase.phase} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <phase.icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{phase.phase}</h3>
                    <p className="text-sm font-medium text-emerald-700 mt-1">System Status: {phase.status}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-slate-700">
                  {phase.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-amber-600 mt-[2px]">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl border border-amber-200 p-7">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">M-Pesa Manual Paybill Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              <p>1. Open M-Pesa and select Lipa na M-Pesa.</p>
              <p>2. Select Paybill.</p>
              <p>3. Enter Business Number: <span className="font-semibold text-slate-900">714777</span>.</p>
              <p>4. Enter Account Number: <span className="font-semibold text-slate-900">440005939461</span>.</p>
              <p className="md:col-span-2">5. Enter the invoice amount and your M-Pesa PIN to complete payment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials and Support Section */}
      <TestimonialsAndSupport />

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Choose RealAcademiQ?
              </h2>
              <div className="space-y-4">
                {[
                  'Expert writers with advanced degrees',
                  '100% original, plagiarism-free content',
                  'On-time delivery guaranteed',
                  '24/7 customer support',
                  'Confidential and secure service',
                  'Affordable pricing with quality assurance',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Ready to Get Started?</h3>
              <p className="text-slate-600 mb-6">
                Submit your order now and let our experts help you succeed. Or track your existing project progress.
              </p>
              <div className="space-y-3">
                <Link href="/order">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Submit New Order <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/track-order">
                  <Button variant="outline" className="w-full">
                    Track Existing Order
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about submitting and tracking your orders
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How do I submit an order?',
                a: 'Simply click "Submit Your Order" and fill out the form with your requirements, topic, deadline, and upload any supporting documents. We\'ll review your order and confirm pricing.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept PayPal for international customers and M-Pesa (STK Push or Manual Paybill) for customers in Kenya. All payments are secure and encrypted.'
              },
              {
                q: 'Can I track my order progress?',
                a: 'Yes! Every order gets a unique Order ID. Use it to track your progress in real-time. You\'ll see which phase your order is in, payment status, and when your work will be ready.'
              },
              {
                q: 'What if I need to make changes?',
                a: 'You can request revisions after viewing the initial draft. Our writers will work with you to ensure the final document meets your expectations.'
              },
              {
                q: 'How long does delivery take?',
                a: 'Delivery time depends on your deadline. Standard orders are completed within the specified timeframe. Rush orders are available for urgent requirements.'
              },
              {
                q: 'Is my information secure?',
                a: 'Absolutely. We use industry-standard encryption and never share your personal information. Your privacy is our priority.'
              }
            ].map((faq, i) => (
              <details key={i} className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-amber-200 transition">
                <summary className="font-semibold text-slate-900 cursor-pointer flex items-center gap-2">
                  <span className="text-amber-600 text-xl">+</span> {faq.q}
                </summary>
                <p className="text-slate-700 mt-4 ml-8">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Achieve Your Academic Goals?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of successful students who trust RealAcademiQ. Submit your order today and get expert help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-amber-700 px-8 py-4 text-lg rounded-xl font-semibold">
                  Start Your Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/track-order">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10 text-white px-8 py-4 text-lg rounded-xl">
                  Track Your Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}