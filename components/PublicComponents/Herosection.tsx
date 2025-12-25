import { 
  Code2,      // Represents coding/development
  Rocket,     // Represents launching/shipping projects
  Flame,       // Represents streak/momentum
  Trophy
} from 'lucide-react'
import { ArrowRight, CheckCircle, Zap, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {

  return (
    <main>
 <section className="relative pt-32 pb-20 px-4 overflow-hidden">
  {/* Subtle Background Pattern */}
  <div className="absolute inset-0 -z-10">
    {/* Dotted Grid Pattern */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle, #1e293b 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }}
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-50/50" />
    
    {/* Organic Shapes - representing growth/journey */}
    <div className="absolute top-20 right-10 w-96 h-96 bg-slate-100/40 rounded-full blur-3xl" />
    <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl" />
  </div>

  <div className="max-w-6xl mx-auto">
    {/* Content */}
    <div className="text-center max-w-3xl mx-auto relative">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-8">
        <Zap className="h-4 w-4 text-slate-700" />
        <span className="text-sm font-medium text-slate-700">Build. Track. Achieve.</span>
      </div>
      
      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
        Master coding through
        <span className="block mt-3 bg-linear-to-r from-slate-600 via-slate-900 to-slate-700 bg-clip-text text-transparent">
          consistent building
        </span>
      </h1>
      
      {/* Subheading */}
      <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Track your projects, build daily momentum, and reach your Arc phase, where consistency transforms into mastery.
      </p>

      {/* CTA */}
      <div className="flex justify-center max-w-lg mx-auto mb-6">
       <Link href={'/auth/sign-in'}>
        <button
          className="px-7 py-3.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
        >
          Start Building
          <ArrowRight className="h-5 w-5" />
        </button>
       </Link>
      </div>

      <p className="text-sm text-slate-500">
        Free now, no credit card required.
      </p>
    </div>

    {/* Visual Stats Dashboard */}
    <div className="mt-24 relative max-w-5xl mx-auto">
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-linear-to-r from-slate-100/50 via-blue-50/50 to-slate-100/50 rounded-2xl blur-2xl -z-10" />
      
      <div className="relative rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-8 shadow-xl shadow-slate-900/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 - Active Journeys */}
          <div className="group relative bg-linear-to-br from-white to-slate-50/50 rounded-xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-slate-600 text-sm font-medium">Active Journeys</span>
            </div>
            <div className="text-5xl font-bold text-slate-900 tracking-tight">12</div>
            <div className="mt-2 text-xs text-slate-500">Building momentum</div>
          </div>

          {/* Stat Card 2 - Arcs Achieved */}
          <div className="group relative bg-linear-to-br from-white to-slate-50/50 rounded-xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-slate-600 text-sm font-medium">Completed Journey</span>
            </div>
            <div className="text-5xl font-bold text-slate-900 tracking-tight">8</div>
            <div className="mt-2 text-xs text-slate-500">Milestones reached</div>
          </div>

          {/* Stat Card 3 - Longest Streak */}
          <div className="group relative bg-linear-to-br from-white to-slate-50/50 rounded-xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-slate-600 text-sm font-medium">Longest Streak</span>
            </div>
            <div className="text-5xl font-bold text-slate-900 tracking-tight">42</div>
            <div className="mt-2 text-xs text-slate-500">Days of consistency</div>
          </div>
        </div>
        
        {/* Social Proof - Developers Building */}
        <div className="mt-6 pt-6 border-t border-slate-200/60">
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-100 to-emerald-50 border-2 border-white shadow-sm flex items-center justify-center">
                <Code2 className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                <Rocket className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-100 to-orange-50 border-2 border-white shadow-sm flex items-center justify-center">
                <Flame className="h-3.5 w-3.5 text-orange-600" />
              </div>
            </div>
            <span>Join developers building every day</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
  )
}

export default HeroSection;