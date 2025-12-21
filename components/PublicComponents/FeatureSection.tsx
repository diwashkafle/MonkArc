import { Target, Github, TrendingUp, Users, Zap, CheckCircle, Sparkles, ArrowUpRight } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50/50 to-white" />
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-linear(circle, #1e293b 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 tracking-tight">
            Everything you need to
          </h2>
          <p className="text-2xl md:text-3xl text-slate-600 font-medium">
            build and learn
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 - Track Progress */}
          <div className="group relative bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">
            {/* linear Glow on Hover */}
            <div className="absolute -inset-0.5 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-blue-50 to-blue-100/50 w-14 h-14 rounded-xl flex items-center justify-center border border-blue-100/50">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
              Track Your Progress
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Set learning goals, track daily check-ins, and watch your progress grow. From Seed to Arc phase.
            </p>
            
            {/* Subtle Arrow Indicator */}
            <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-blue-600 transition-colors">
              <span className="font-medium">Learn more</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Feature 2 - GitHub Integration */}
          <div className="group relative bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">
            <div className="absolute -inset-0.5 bg-linear-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/10 group-hover:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-slate-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-slate-50 to-slate-100/50 w-14 h-14 rounded-xl flex items-center justify-center border border-slate-100/50">
                <Github className="h-6 w-6 text-slate-700" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-slate-700 transition-colors">
              GitHub Integration
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Connect your repositories and automatically track commits. Your code, your progress.
            </p>
            
            <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-slate-700 transition-colors">
              <span className="font-medium">Learn more</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Feature 3 - Build Streaks */}
          <div className="group relative bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">
            <div className="absolute -inset-0.5 bg-linear-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-orange-50 to-orange-100/50 w-14 h-14 rounded-xl flex items-center justify-center border border-orange-100/50">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-orange-600 transition-colors">
              Build Streaks
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Consistency is key. Build daily streaks and celebrate milestones along your journey.
            </p>
            
            <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-orange-600 transition-colors">
              <span className="font-medium">Learn more</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Feature 4 - Community Feed */}
          <div className="group relative bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">
            <div className="absolute -inset-0.5 bg-linear-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-emerald-50 to-emerald-100/50 w-14 h-14 rounded-xl flex items-center justify-center border border-emerald-100/50">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors">
              Community Feed
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Share your journey, get inspired by others, and grow together with the community.
            </p>
            
            <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-emerald-600 transition-colors">
              <span className="font-medium">Learn more</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Feature 5 - Resource Manager */}
          <div className="group relative bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">
            <div className="absolute -inset-0.5 bg-linear-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-yellow-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-yellow-50 to-yellow-100/50 w-14 h-14 rounded-xl flex items-center justify-center border border-yellow-100/50">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-yellow-600 transition-colors">
              Resource Manager
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Save learning resources, videos, and docs. Everything you need in one place.
            </p>
            
            <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-yellow-600 transition-colors">
              <span className="font-medium">Learn more</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Feature 6 - Flexible Goals */}
          <div className="group relative bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">
            <div className="absolute -inset-0.5 bg-linear-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-purple-50 to-purple-100/50 w-14 h-14 rounded-xl flex items-center justify-center border border-purple-100/50">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-purple-600 transition-colors">
              Flexible Goals
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Extend journeys, pause when needed, or mark complete. Adapt to your learning pace.
            </p>
            
            <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-purple-600 transition-colors">
              <span className="font-medium">Learn more</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}