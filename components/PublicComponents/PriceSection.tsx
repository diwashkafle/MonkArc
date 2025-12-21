import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function PricingSection() {
  const features = [
    "Unlimited journeys",
    "Daily check-ins",
    "Streak tracking",
    "Full access to all features"
  ]

  return (
    <section id="pricing" className="relative py-20 px-4">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="max-w-4xl mx-auto relative">
        {/* Section Header - Minimal */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 tracking-tight">
            Free for now
          </h2>
          <p className="text-lg text-slate-600">
            Get started today. No credit card required.
          </p>
        </div>

        {/* Single Minimal Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
            {/* Price */}
            <div className="text-center mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-sm text-slate-500">Currently in beta</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-slate-700" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
           <Link href={'/auth/sign-in'}>
            <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Get Started
            </button>
           </Link>
          </div>

          {/* Simple Note */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Early users get lifetime access to core features
          </p>
        </div>
      </div>
    </section>
  )
}