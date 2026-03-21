import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Users, Award, BookOpen, Target, Heart, Shield } from 'lucide-react'

const stats = [
  { number: '5000+', label: 'Students Helped' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '50+', label: 'Expert Writers' },
  { number: '24/7', label: 'Support Available' },
]

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for the highest quality in everything we do, ensuring academic success for our clients.'
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'Honest, transparent, and ethical practices in all our academic assistance services.'
  },
  {
    icon: Shield,
    title: 'Confidentiality',
    description: 'Your privacy and academic integrity are our top priorities. All work is handled securely.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with students to understand their needs and provide personalized solutions.'
  }
]

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-black py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <p className="text-orange-400 font-semibold text-sm tracking-wide uppercase mb-3">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Empowering Academic Success
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              We&apos;re dedicated to helping students achieve their academic goals through professional,
              ethical assistance and guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-white/70">
                <p>
                  Founded by a team of experienced academics and educators, RealAcademiQ was born
                  from the desire to make quality education accessible to all students worldwide.
                </p>
                <p>
                  We understand the challenges students face in today&apos;s competitive academic environment.
                  Our mission is to provide reliable, professional assistance that helps students not just
                  pass their courses, but truly understand and master their subjects.
                </p>
                <p>
                  With years of experience and a network of qualified experts, we offer comprehensive
                  support for assignments, thesis, projects, and research proposals across all academic disciplines.
                </p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-lg shadow-black/10">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Why Students Choose Us</h3>
              <div className="space-y-4">
                {[
                  'Expert writers with advanced degrees',
                  '100% original, plagiarism-free work',
                  'On-time delivery guarantee',
                  '24/7 customer support',
                  'Affordable pricing',
                  'Confidential and secure service'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-white/70">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="text-center"
              >
                <div className="w-16 h-16 bg-orange-100 border border-orange-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-xl text-orange-50/90 mb-8">
              Join thousands of successful students who trust RealAcademiQ for their academic needs.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-orange-700 px-8 py-4 text-lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}