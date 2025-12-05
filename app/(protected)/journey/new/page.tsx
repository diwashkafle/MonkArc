import Link from 'next/link'

export default function NewJourneyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Start a New Journey
          </h1>
          <p className="mt-2 text-slate-600">
            Choose the type of journey you want to embark on
          </p>
        </div>
        
        {/* Journey Type Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Learning Journey */}
          <Link
            href="/journey/new/learning"
            className="group rounded-xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-blue-500 hover:shadow-lg"
          >
            <div className="text-5xl">📚</div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-blue-600">
              Learning Journey
            </h2>
            <p className="mt-3 text-slate-600">
              Master a new skill, topic, or technology through consistent study and practice.
            </p>
            
            <div className="mt-6 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Track your learning progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Add resource links and notes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Daily journal entries</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm font-medium text-blue-600 group-hover:underline">
              Create Learning Journey →
            </div>
          </Link>
          
          {/* Project Journey */}
          <Link
            href="/journey/new/project"
            className="group rounded-xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-purple-500 hover:shadow-lg"
          >
            <div className="text-5xl">💻</div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-purple-600">
              Project Journey
            </h2>
            <p className="mt-3 text-slate-600">
              Build something real. Track your progress from idea to deployment.
            </p>
            
            <div className="mt-6 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>GitHub integration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Track commits and progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Define deliverables</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm font-medium text-purple-600 group-hover:underline">
              Create Project Journey →
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}