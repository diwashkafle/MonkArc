import { Sprout, Code2, Trophy, ArrowRight, Sparkles, Link } from 'lucide-react'

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 px-4 overflow-hidden bg-white">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-50/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 tracking-tight">
            Simple, yet powerful
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            From idea to Arc phase in three steps
          </p>
        </div>

        {/* Flow Visualization */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-200 via-blue-200 to-orange-200" />
            {/* Animated flowing dots */}
            <div className="absolute inset-0 bg-linear-to-r from-emerald-400 via-blue-400 to-orange-400 opacity-40 animate-pulse" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Step 1 - Create Journey */}
            <div className="group relative">
              {/* Card */}
              <div className="relative bg-linear-to-br from-white to-emerald-50/30 rounded-2xl p-8 border border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-br from-emerald-400/20 to-emerald-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Sprout className="h-10 w-10 text-white" />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    1
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-slate-900 text-center">
                  Create Journey
                </h3>
                <p className="text-slate-600 leading-relaxed text-center">
                  Start with a project idea. Set your goal and timeline. Begin in Seed phase.
                </p>

                {/* Visual Indicator */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-emerald-600">Seed Phase</span>
                </div>
              </div>

              {/* Arrow Connector - Desktop */}
              <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-emerald-200 flex items-center justify-center shadow-md">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                </div>
              </div>

              {/* Arrow Connector - Mobile */}
              <div className="md:hidden flex justify-center my-4">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-emerald-200 flex items-center justify-center shadow-md rotate-90">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Step 2 - Build Daily */}
            <div className="group relative">
              {/* Card */}
              <div className="relative bg-linear-to-br from-white to-blue-50/30 rounded-2xl p-8 border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-br from-blue-400/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="h-10 w-10 text-white" />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    2
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-slate-900 text-center">
                  Build Daily
                </h3>
                <p className="text-slate-600 leading-relaxed text-center">
                  Check in daily. Track progress. Build streaks. Watch your journey grow.
                </p>

                {/* Visual Indicator */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs font-medium text-blue-600">Growth Phase</span>
                </div>
              </div>

              {/* Arrow Connector - Desktop */}
              <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center shadow-md">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              {/* Arrow Connector - Mobile */}
              <div className="md:hidden flex justify-center my-4">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center shadow-md rotate-90">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Step 3 - Reach Arc */}
            <div className="group relative">
              {/* Card */}
              <div className="relative bg-linear-to-br from-white to-orange-50/30 rounded-2xl p-8 border border-orange-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-br from-orange-400/20 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    3
                  </div>
                  {/* Success sparkle */}
                  <div className="absolute -top-1 -left-1">
                    <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-slate-900 text-center">
                  Reach Arc
                </h3>
                <p className="text-slate-600 leading-relaxed text-center">
                  Hit your target. Celebrate the milestone. Extend or complete—your choice.
                </p>

                {/* Visual Indicator */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-xs font-medium text-orange-600">Arc Phase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link href={'/auth/sign-in'}>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 cursor-pointer group">
              <span className="font-semibold">Start your journey today</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}