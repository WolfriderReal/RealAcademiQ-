import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Award, Users, Star, ArrowRight, FileText, BarChart3, BookOpen, FolderKanban } from 'lucide-react'

const services = [
  {
    icon: BookOpen,
    title: 'Small Assignments',
    description: 'Fast support for short assignments, essays, quizzes, and weekly coursework tasks.',
    features: ['Short-turnaround handling', 'Clear instructions follow-up', 'Plagiarism-safe drafting', 'Formatting + references'],
    price: 'Ksh 2,000 - 10,000'
  },
  {
    icon: Award,
    title: "Master's Thesis",
    description: 'Full thesis support from proposal alignment to final defense-ready manuscript.',
    features: ['Research framework', 'Chapter development', 'Academic formatting', 'Supervisor-ready delivery'],
    price: 'Ksh 25,000 - 40,000'
  },
  {
    icon: FileText,
    title: 'PhD Dissertation',
    description: 'Advanced dissertation support for doctoral-level research projects and publication-grade work.',
    features: ['Literature synthesis', 'Methodology design', 'Data interpretation', 'Publication-level editing'],
    price: 'Ksh 40,000 - 80,000 depending on complexity'
  },
  {
    icon: Star,
    title: 'Proposal / Concept Note',
    description: 'Professional proposals for grants, research programs, and academic concept notes.',
    features: ['Problem framing', 'Methodology and budget', 'Timeline and outputs', 'Donor-aligned structure'],
    price: 'Ksh 2,500 - 10,000 per milestone'
  },
  {
    icon: FolderKanban,
    title: 'Diploma Projects',
    description: 'Structured project support for diploma-level practical and report-based assessments.',
    features: ['Topic scoping', 'Project write-up', 'Implementation guidance', 'Presentation readiness'],
    price: 'Ksh 15,000'
  },
  {
    icon: Users,
    title: 'Undergraduate Projects',
    description: 'Comprehensive undergraduate project support from proposal to final documentation.',
    features: ['Proposal + methodology', 'Build/analysis support', 'Testing and revision', 'Final documentation'],
    price: 'Ksh 20,000 - 30,000'
  },
  {
    icon: BarChart3,
    title: 'Basic Data-Analysis Guidance',
    description: 'Introductory support with data preparation, basic analysis, and understanding outputs.',
    features: ['Basic data-cleaning guidance', 'Descriptive analysis support', 'Output interpretation', 'Results explanation'],
    price: 'Ksh 2,000 - 8,000'
  },
  {
    icon: BarChart3,
    title: 'More Involved Data-Analysis Guidance',
    description: 'Support for more involved quantitative or qualitative analysis. Complex work is quoted after reviewing the requirements.',
    features: ['Method selection guidance', 'Analysis workflow support', 'Output interpretation', 'Results reporting guidance'],
    price: 'Ksh 8,000 - 20,000; complex work quoted after review'
  },
  {
    icon: Star,
    title: 'Proofreading',
    description: 'Proofreading for grammar, clarity, and consistency. Price depends on document condition and turnaround time.',
    features: ['Grammar and spelling checks', 'Clarity and flow suggestions', 'Citation-format consistency checks', 'Scope and turnaround agreed first'],
    price: 'About Ksh 1,500 - 4,500 per 3,000 words'
  },
]

export default function Services() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 via-emerald-950/70 to-black pt-20 pb-8 md:pt-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">Our Services</p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Academic Support Services</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">Student-focused guidance, feedback, and editing.</p>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-300">Prices are indicative. We will confirm the exact scope, deliverables, deadline, and final price in writing before you decide whether to proceed.</p>
        </div>
      </section>

      <section className="bg-white pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-medium text-emerald-800 md:text-base">Our academic support is intended to help you learn and improve your own work. You are responsible for following your institution's academic integrity policies. We provide guidance, feedback, and editing—not work to submit as your own.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg shadow-black/10 transition-colors hover:border-orange-300">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-orange-200 bg-orange-100">
                  <service.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-slate-900">{service.title}</h2>
                <p className="mb-6 text-slate-600">{service.description}</p>
                <ul className="mb-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <span className="font-semibold text-orange-700">{service.price}</span>
                  <Link href="/order">
                    <Button className="bg-orange-500 text-white hover:bg-orange-600">Request support <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">How It Works</h2>
            <p className="text-lg text-slate-600">Agree on the support, scope, and price before payment.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Send a request', desc: 'Tell us what guidance or feedback you need.' },
              { step: '02', title: 'Agree the scope', desc: 'We confirm the deliverables, timeline, and price in writing.' },
              { step: '03', title: 'Get support', desc: 'Work with us on the agreed guidance or editing.' },
              { step: '04', title: 'Review your work', desc: 'Use the feedback to understand and improve your own work.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">{item.step}</div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
