'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { InferSelectModel } from 'drizzle-orm'
import { journeys } from '@/db/schema'
import { SiCodefresh, SiCodeigniter } from 'react-icons/si'
import { MdSevereCold } from "react-icons/md";
import { GiDeathNote } from "react-icons/gi";
import { GiAzulFlake } from "react-icons/gi";

interface DashboardFiltersProps {
  journeys: InferSelectModel<typeof journeys>[]
}

type StatusFilter = 'all' | 'active' | 'frozen' | 'dead' | 'completed'
type PhaseFilter = 'all' | 'seed' | 'arc'

export function DashboardFilters({ journeys }: DashboardFiltersProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Helper function to calculate days since last check-in
  const daysSinceLastCheckIn = (lastCheckInDate: string | null) => {
    if (!lastCheckInDate) return 0
    const last = new Date(lastCheckInDate)
    const today = new Date()
    last.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  // Filter journeys
  const filteredJourneys = journeys.filter((journey) => {
    // Status filter
    if (statusFilter !== 'all' && journey.status !== statusFilter) {
      return false
    }
    
    // Phase filter
    if (phaseFilter !== 'all' && journey.phase !== phaseFilter) {
      return false
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = journey.title.toLowerCase().includes(query)
      const matchesDescription = journey.description.toLowerCase().includes(query)
      const matchesTech = journey.techStack?.some(tech => 
        tech.toLowerCase().includes(query)
      )
      
      if (!matchesTitle && !matchesDescription && !matchesTech) {
        return false
      }
    }
    
    return true
  })
  
  // Count by status
  const counts = {
    all: journeys.length,
    active: journeys.filter(j => j.status === 'active').length,
    frozen: journeys.filter(j => j.status === 'frozen').length,
    dead: journeys.filter(j => j.status === 'dead').length,
    completed: journeys.filter(j => j.status === 'completed').length,
  }
  
  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search journeys by title, description, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6 space-y-4">
        {/* Status Filter */}
        <div>
          <div className="text-sm font-medium text-slate-700 mb-2">Status</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              All ({counts.all})
            </button>
            
            <button
              onClick={() => setStatusFilter('active')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Active ({counts.active})
            </button>
            
            <button
              onClick={() => setStatusFilter('frozen')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === 'frozen'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Frozen ({counts.frozen})
            </button>
            
            <button
              onClick={() => setStatusFilter('dead')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === 'dead'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Dead ({counts.dead})
            </button>
            
            <button
              onClick={() => setStatusFilter('completed')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Completed ({counts.completed})
            </button>
          </div>
        </div>
        
        {/* Type & Phase Filters */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Phase Filter */}
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Phase</div>
            <div className="flex gap-2">
              <button
                onClick={() => setPhaseFilter('all')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  phaseFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              
              <button
                onClick={() => setPhaseFilter('seed')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  phaseFilter === 'seed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
               <span className='flex gap-1 justify-center items-center'> <SiCodefresh /> Seed</span>
              </button>
        
              <button
                onClick={() => setPhaseFilter('arc')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  phaseFilter === 'arc'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
              <span className='flex gap-1 justify-center items-center'><GiAzulFlake /> Arc</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-600">
        Showing {filteredJourneys.length} of {journeys.length} journeys
      </div>
      
      {/* Journey Cards */}
      {filteredJourneys.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <div className="text-6xl">🔍</div>
          <h4 className="mt-4 text-lg font-semibold text-slate-900">
            No journeys match your filters
          </h4>
          <p className="mt-2 text-slate-600">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJourneys.map((journey) => {
            const daysSince = daysSinceLastCheckIn(journey.lastCheckInDate)
            
            return (
              <div
                key={journey.id}
                className={`rounded-lg bg-white p-6 shadow-sm ${
                  journey.status === 'frozen' ? 'border-2 border-blue-400' : 
                  journey.status === 'dead' ? 'border-2 border-red-400' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {journey.status === 'dead' ? <GiDeathNote /> : 
                         journey.status === 'frozen' ? <MdSevereCold/> : 
                         journey.phase === 'arc' ? <GiAzulFlake/> : <SiCodefresh/>}
                      </span>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {journey.title}
                      </h4>
                      {journey.phase === 'arc' && journey.status !== 'dead' && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                          Arc
                        </span>
                      )}
                      {journey.status === 'frozen' && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          Frozen
                        </span>
                      )}
                      {journey.status === 'dead' && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          Dead
                        </span>
                      )}
                      {journey.status === 'completed' && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm text-slate-600">
                      {journey.description}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                      <span>
                        {journey.totalCheckIns}/{journey.targetCheckIns} check-ins
                      </span>
                      <span>•</span>
                      <span>
                        {journey.currentStreak > 0 
                          ? `${journey.currentStreak} day streak 🔥` 
                          : 'No current streak'}
                      </span>
                      {journey.status === 'active' && daysSince > 0 && (
                        <>
                          <span>•</span>
                          <span className={daysSince >= 2 ? 'text-yellow-600 font-medium' : ''}>
                            {daysSince} {daysSince === 1 ? 'day' : 'days'} since last check-in
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    href={`/journey/${journey.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}