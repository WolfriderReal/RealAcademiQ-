import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpenText, FileText, Search, PenSquare, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react'
import TestimonialsAndSupport from '@/components/TestimonialsAndSupport'
import HeroCtas from '@/components/HeroCtas'

const services = [
  {
    icon: BookOpenText,
    title: 'Tutoring & Coaching',
    desc: 'Targeted support for coursework, presentations, revision plans, and exam preparation.',
  },
  {
    icon: FileText,
    title: 'Editing & Proofreading',
    desc: 'Improve grammar, structure, clarity, and citation consistency before submission.',
  },
  {
    icon: Search,
    title: 'Research Guidance',
    desc: 'Get help with topic selection, literature reviews, methodology, and critical analysis.',
  },
  {
    icon: PenSquare,
    title: 'Writing Support',
    desc: 'From thesis chapters to polished reports, we help shape strong academic writing.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Share your brief',
    desc: 'Tell us the task, deadline, and the level of support you want.',
  },
  {
    step: '02',
    title: 'Get expert guidance',
    desc: 'Work with a qualified tutor or editor tailored to your subject and needs.',
  },
  {
    step: '03',
    title: 'Submit with confidence',
    desc: 'Receive clear, professional, ready-to-submit work and optional revisions.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-950 via-emerald-950/70 to-black py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] font-semibold text-emerald-300 mb-4">
              Academic support you can trust
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
              Get expert academic support,
              <span className="text-emerald-300 block md:inline"> from research guidance to polished final drafts.</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
              From tutoring and editing to thesis support and writing coaching, RealAcademiQ helps students and researchers move from confused to confident.
            </p>
            <HeroCtas />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Clear process</h3>
                <p className="text-sm text-slate-600">Simple steps, transparent updates, and support at every stage.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Professional service</h3>
                <p className="text-sm text-slate-600">Structured guidance focused on clarity, quality, and academic standards.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Practical outcomes</h3>
                <p className="text-sm text-slate-600">Feedback that helps you understand, improve, and submit with confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works in 3 steps</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A simple, guided process from first brief to final submission.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((item) => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-black/5">
                <div className="mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-700 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What we help with</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Focused support designed for students, researchers, and professionals who need clarity and polish.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
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

      <TestimonialsAndSupport mode="public" />

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why students choose RealAcademiQ</h2>
              <div className="space-y-4">
                {[
                  'Clear, practical guidance from subject-aware support professionals',
                  'Structured feedback that improves quality and confidence',
                  'Transparent process and realistic timelines',
                  'Support across tutoring, writing, research, and editing',
                  'Safe, professional communication via WhatsApp and email',
                  'Focused revisions to align with your brief and academic standards',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-2xl shadow-black/20">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Ready to move forward?</h3>
              <p className="text-slate-600 mb-6">
                Tell us what you need, and we’ll help you plan the next step with clarity and confidence.
              </p>
              <div className="space-y-3">
                <Link href="/order">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Start Your Order <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need reliable academic support?</h2>
          <p className="text-xl text-white/90 mb-8">
            We help with academic guidance, research support, writing coaching, and polished final drafts.
          </p>
          <Link href="/order">
            <Button size="lg" className="bg-white hover:bg-slate-100 text-orange-700 px-8 py-4 text-lg rounded-xl font-semibold">
              Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
