import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, Users, Star, ArrowRight, FileText, BarChart3, BookOpen, FolderKanban } from 'lucide-react'

const services = [
  {
    icon: BookOpen,
    title: 'Small Assignments',
    description: 'Fast support for short assignments, essays, quizzes, and weekly coursework tasks.',
    features: ['Short-turnaround handling', 'Clear instructions follow-up', 'Plagiarism-safe drafting', 'Formatting + references'],
    price: 'USD $15 - $80 per task | Ksh 2,000 - 10,000'
  },
  {
    icon: Award,
    title: 'Master\'s Thesis',
    description: 'Full thesis support from proposal alignment to final defense-ready manuscript.',
    features: ['Research framework', 'Chapter development', 'Academic formatting', 'Supervisor-ready delivery'],
    price: 'USD $600 - $2,000 | Ksh 50,000 - 150,000'
  },
  {
    icon: FileText,
    title: 'PhD Dissertation',
    description: 'Advanced dissertation support for doctoral-level research projects and publication-grade work.',
    features: ['Literature synthesis', 'Methodology design', 'Data interpretation', 'Publication-level editing'],
    price: 'USD $500 - $1,500 | Ksh 50,000 - 150,000'
  },
  {
    icon: Star,
    title: 'Proposal / Concept Note',
    description: 'Professional proposals for grants, research programs, and academic concept notes.',
    features: ['Problem framing', 'Methodology and budget', 'Timeline and outputs', 'Donor-aligned structure'],
    price: 'USD $100 - $500 | Ksh 10,000 - 50,000'
  },
  {
    icon: FolderKanban,
    title: 'Diploma Projects',
    description: 'Structured project support for diploma-level practical and report-based assessments.',
    features: ['Topic scoping', 'Project write-up', 'Implementation guidance', 'Presentation readiness'],
    price: 'USD $150 - $400 | Ksh 15,000 - 40,000'
  },
  {
    icon: Users,
    title: 'Undergraduate Projects',
    description: 'Comprehensive undergraduate project support from proposal to final documentation.',
    features: ['Proposal + methodology', 'Build/analysis support', 'Testing and revision', 'Final documentation'],
    price: 'USD $150 - $500 | Ksh 15,000 - 50,000'
  },
  {
    icon: BarChart3,
    title: 'Data Analysis (SPSS, Stata, etc.)',
    description: 'Reliable quantitative and qualitative analysis with clear interpretation and presentation.',
    features: ['Data cleaning', 'Model selection', 'Output interpretation', 'Results reporting'],
    price: 'USD $300 - $500 | Ksh 40,000 - 50,000'
  },
  {
    icon: Star,
    title: 'Editing & Proofreading',
    description: 'Language polishing, structure improvement, and academic compliance checks.',
    features: ['Grammar and style polish', 'Citation checks', 'Flow and clarity edits', 'Final QA pass'],
    price: '~USD $0.02 - $0.04/word | 3,000 words: $78 - $217 (Ksh 10,000 - 28,000)'
  }
]


export default function Services() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-black pt-20 md:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <p className="text-orange-400 font-semibold text-sm tracking-wide uppercase mb-3">Our Services</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Academic Excellence Services
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              Professional support with transparent pricing for International and Ksh Local Payments.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pt-8 pb-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4">
            <p className="text-sm md:text-base text-emerald-200 font-medium">
              All our works are checked for plagiarism and AI to ensure compliance with your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white border border-slate-200 p-8 rounded-xl hover:border-orange-300 transition-colors shadow-lg shadow-black/10"
              >
                <div className="w-16 h-16 bg-orange-100 border border-orange-200 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6">{service.description}</p>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 font-semibold">{service.price}</span>
                  <Link href="/order">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Order Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/70">
              Simple process to get your academic work done professionally
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Place Order', desc: 'Tell us your requirements and deadline' },
              { step: '02', title: 'Expert Assignment', desc: 'We assign the best writer for your task' },
              { step: '03', title: 'Quality Work', desc: 'Receive high-quality, original content' },
              { step: '04', title: 'On-Time Delivery', desc: 'Get your work delivered before deadline' },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center"
              >
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Academic Help?
            </h2>
            <p className="text-xl text-orange-50/90 mb-8">
              Choose your service above and submit your order. Our expert writers will deliver quality work on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-orange-700 px-8 py-4 text-lg rounded-xl font-semibold">
                  Start Your Order <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/track-order">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10 text-white px-8 py-4 text-lg rounded-xl">
                  Track Existing Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}