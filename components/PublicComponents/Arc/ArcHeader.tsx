import { Trophy, Calendar, CheckCircle, Lock, Globe } from 'lucide-react'
import type { journeys } from '@/db/schema'
import Image from 'next/image'
import Link from 'next/link'
type Journey = typeof journeys.$inferSelect

interface ArcHeaderProps {
  journey: Journey
  isOwner: boolean
  username:string | null | undefined;
  image:string | null | undefined;
  name:string  | null | undefined;
}

export function ArcHeader({ journey, isOwner,image,name,username }: ArcHeaderProps) {
  const completedDate = journey.completedAt 
    ? new Date(journey.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown'

  return (
    <div className="relative overflow-hidden mt-10 rounded-2xl bg-linear-to-br from-orange-50 via-white to-orange-50/30 border border-orange-200/60 p-8 md:p-12">
      {/* Decorative linear orbs */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-100/30 blur-3xl" />
      
      <div className="relative">
        {/* Badges Row */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Arc Badge */}
           <div className="flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-orange-500/30">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-bold">Arc Completed</span>
          </div>

          {/* Privacy Badge */}
          {journey.isPublic ? (
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 border border-slate-200">
              <Globe className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Public</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 border border-slate-200">
              <Lock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Private</span>
            </div>
          )}

          {/* Extended Badge (if extended) */}
          {journey.isExtended && (
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-blue-700 border border-blue-200">
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                Extended {journey.timesExtended}x
              </span>
            </div>
          )}        
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          {journey.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
          {journey.description}
        </p>

        {/* Completion Date */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-orange-600" />
          <span>Completed on <span className="font-semibold text-slate-900">{completedDate}</span></span>
        </div>
         {
          !isOwner && <Link className='cursor-pointer' href={`/profile/${username}`}>
            <section className='border w-50 my-2 items-center gap-3 flex border-gray-300 rounded-lg bg-slate-100 px-2 p-1'>
              <Image className='rounded-full' src={image || ""} alt="image" height={20} width={30}/>
              <span className='text-gray-600 font-semibold'>{name}</span>
          </section>
          </Link>
         }

        {/* Tech Stack (if available) */}
        {journey.techStack && journey.techStack.length > 0 && (
          <div className="mt-6 pt-6 border-t border-orange-200/50">
            <div className="text-sm font-medium text-slate-600 mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {journey.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Link (if available) */}
        {journey.repoURL && (
          <div className="mt-4">
            <a
              href={journey.repoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Repository
            </a>
          </div>
        )}
      </div>
    </div>
  )
}