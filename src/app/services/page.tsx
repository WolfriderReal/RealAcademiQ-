import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CheckCircle, BookOpen, Award, Users, Star, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: BookOpen,
    title: 'Assignment Help',
    description: 'Comprehensive assistance with essays, reports, case studies, and homework across all subjects and academic levels.',
    features: ['Custom research', 'Plagiarism-free content', 'On-time delivery', 'Expert writers'],
    price: 'From $15/page'
  },
  {
    icon: Award,
    title: 'Thesis Writing',
    description: 'Complete thesis development including research, writing, editing, and defense preparation.',
    features: ['Topic selection', 'Literature review', 'Data analysis', 'Final editing'],
    price: 'From $50/page'
  },
  {
    icon: Users,
    title: 'Project Development',
    description: 'End-to-end project assistance from planning to implementation and documentation.',
    features: ['Project planning', 'Code development', 'Testing & debugging', 'Documentation'],
    price: 'From $30/hour'
  },
  {
    icon: Star,
    title: 'Research Proposals',
    description: 'Professional proposal writing for grants, dissertations, and academic research projects.',
    features: ['Research design', 'Methodology', 'Budget planning', 'Timeline creation'],
    price: 'From $100'
  }
]

export default function Services() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <p className="text-amber-600 font-semibold text-sm tracking-wide uppercase mb-3">Our Services</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Academic Excellence Services
            </h1>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
              Professional assistance tailored to your academic needs. From assignments to thesis completion.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-amber-600" />
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
                  <span className="text-amber-600 font-semibold">{service.price}</span>
                  <Link href="/contact">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Simple process to get your academic work done professionally
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Place Order', desc: 'Tell us your requirements and deadline' },
              { step: '02', title: 'Expert Assignment', desc: 'We assign the best writer for your task' },
              { step: '03', title: 'Quality Work', desc: 'Receive high-quality, original content' },
              { step: '04', title: 'On-Time Delivery', desc: 'Get your work delivered before deadline' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="text-center"
              >
                <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}