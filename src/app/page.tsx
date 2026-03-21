
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Award, Users, Star, CheckCircle } from 'lucide-react'
import TestimonialsAndSupport from '@/components/TestimonialsAndSupport'
import HeroCtas from '@/components/HeroCtas'

export default function Home() {
  const services = [
    { icon: BookOpen, title: 'Assignments', desc: 'High-quality solutions for all subjects and levels' },
    { icon: Award, title: 'Thesis', desc: 'Complete thesis writing and research assistance' },
    { icon: Users, title: 'Projects', desc: 'End-to-end project development and guidance' },
    { icon: Star, title: 'Proposals', desc: 'Compelling research proposals and grant applications' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-emerald-950/70 to-black py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
              Achieve Academic
              <span className="text-emerald-300"> Excellence</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
              Professional assistance with assignments, thesis, projects, and proposals.
              Get expert help from qualified academics and elevate your academic performance.
            </p>
            <HeroCtas />
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Real-Time Tracking</h3>
                <p className="text-sm text-slate-600">Monitor your order progress at every phase with instant updates</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Multiple Payment Options</h3>
                <p className="text-sm text-slate-600">Pay securely via PayPal or M-Pesa with flexible payment terms</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Secure & Confidential</h3>
                <p className="text-sm text-slate-600">Your information is encrypted and never shared with third parties</p>
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
                className="bg-white border border-slate-200 p-6 rounded-xl hover:border-orange-300 transition-colors shadow-lg shadow-black/10"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 border border-orange-200">
                  <service.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials and Support Section */}
      <TestimonialsAndSupport mode="public" />

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
            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-2xl shadow-black/20">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Ready to Get Started?</h3>
              <p className="text-slate-600 mb-6">
                Submit your order now and let our experts help you succeed. Or track your existing project progress.
              </p>
              <div className="space-y-3">
                <Link href="/order">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Submit New Order <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/track-order">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-100">
                    Track Existing Order
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
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
                a: 'Click "Submit Your Order", fill in your requirements, and continue to review. You can then share supporting files and reconfirm instructions via WhatsApp before payment.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept PayPal for international customers and M-Pesa (STK Push or Manual Paybill) for customers in Kenya. All payments are secure and encrypted.'
              },
              {
                q: 'Can I track my order progress?',
                a: 'Yes. Use the Track Order page to open WhatsApp tracking with our support team. Share your order details there and we will provide your current status and next steps.'
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
              <details key={i} className="bg-white rounded-lg p-6 border border-slate-200 hover:border-orange-400/30 transition">
                <summary className="font-semibold text-slate-900 cursor-pointer flex items-center gap-2">
                  <span className="text-orange-400 text-xl">+</span> {faq.q}
                </summary>
                <p className="text-slate-600 mt-4 ml-8">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Achieve Your Academic Goals?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of successful students who trust RealAcademiQ. Submit your order today and get expert help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-orange-700 px-8 py-4 text-lg rounded-xl font-semibold">
                  Start Your Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/track-order">
                <Button size="lg" variant="outline" className="border-white hover:bg-slate-100 text-slate-900 px-8 py-4 text-lg rounded-xl">
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