'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { InferSelectModel } from 'drizzle-orm'
import { journeys } from '@/db/schema'
import { SiCodefresh, SiCodeigniter } from 'react-icons/si'
import { MdSevereCold } from "react-icons/md"
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { GiDeathNote, GiAzulFlake } from "react-icons/gi"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
      
      {/* Filter Selects */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Status Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All ({counts.all})
              </SelectItem>
              <SelectItem value="active">
                <span className="flex items-center gap-2">
                  Active ({counts.active})
                </span>
              </SelectItem>
              <SelectItem value="frozen">
                <span className="flex items-center gap-2">
                  Frozen ({counts.frozen})
                </span>
              </SelectItem>
              <SelectItem value="dead">
                <span className="flex items-center gap-2">
                  Dead ({counts.dead})
                </span>
              </SelectItem>
              <SelectItem value="completed">
                <span className="flex items-center gap-2">
                  Completed ({counts.completed})
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Phase Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phase
          </label>
          <Select 
            value={phaseFilter} 
            onValueChange={(value) => setPhaseFilter(value as PhaseFilter)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Phases
              </SelectItem>
              <SelectItem value="seed">
                <span className="flex items-center gap-2">
                  <SiCodefresh className="h-4 w-4" />
                  Seed
                </span>
              </SelectItem>
              <SelectItem value="arc">
                <span className="flex items-center gap-2">
                  <GiAzulFlake className="h-4 w-4" />
                  Arc
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-600">
        Showing {filteredJourneys.length} of {journeys.length} journeys
      </div>
      
      {/* Journey Cards */}
      {filteredJourneys.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
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
                className={`rounded-lg bg-white p-6 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-900">
                      {journey.title.length > 40 ? journey.title.slice(0,30)+"...":journey.title}
                      </h4>
                      {journey.phase === 'seed' && (
                        <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                         <span className='text-base'><SiCodefresh/></span> Seed
                        </span>
                      )}
                      {journey.phase === 'arc' && journey.status !== 'dead' && (
                        <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                         <span className='text-base'><GiAzulFlake/></span> Arc
                        </span>
                      )}
                      {journey.status === 'frozen' && (
                        <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                         <span className='text-base'> <MdSevereCold/></span>Frozen
                        </span>
                      )}
                      {journey.status === 'dead' && (
                        <span className="rounded-full flex items-center gap-1 bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                         <span className='text-base'><GiDeathNote /></span> Dead
                        </span>
                      )}
                      {journey.status === 'completed' && (
                        <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 font-medium text-gray-700">
                          <IoCheckmarkDoneCircleSharp/> <span className='text-xs py-1'>Completed</span>
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
                          ? (<div className='flex gap-1 items-center'>
                            <h1>{journey.currentStreak} day streak</h1> <span className='text-gray-800'><SiCodeigniter/></span>
                          </div>)
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