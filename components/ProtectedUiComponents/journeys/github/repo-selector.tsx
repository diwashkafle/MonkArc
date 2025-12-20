'use client'

import { useState, useEffect } from 'react'
import { Search, Check, Lock, Globe } from 'lucide-react'
import { fetchUserRepos, type GitHubRepo } from '@/lib/github/github-repos'
import { Input } from '@/components/ui/input'

interface RepoSelectorProps {
  onSelect: (repoUrl: string) => void
  selectedRepo?: string | null
}

export function RepoSelector({ onSelect, selectedRepo }: RepoSelectorProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRepoUrl, setSelectedRepoUrl] = useState(selectedRepo || '')

  useEffect(() => {
    loadRepos()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = repos.filter(repo =>
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRepos(filtered)
    } else {
      setFilteredRepos(repos)
    }
  }, [searchQuery, repos])

  const loadRepos = async () => {
    setIsLoading(true)
    try {
      const userRepos = await fetchUserRepos()
      if (userRepos) {
        setRepos(userRepos)
        setFilteredRepos(userRepos)
      }
    } catch (error) {
      console.error('Failed to load repos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectRepo = (repo: GitHubRepo) => {
    const repoUrl = repo.html_url
    setSelectedRepoUrl(repoUrl)
    onSelect(repoUrl)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading your repositories...</p>
        </div>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-slate-600">No repositories found</p>
        <p className="text-sm text-slate-500 mt-1">
          Create a repository on GitHub first
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Repo List */}
      <div className="max-h-[400px] overflow-y-auto space-y-2 rounded-lg border border-slate-200 p-2">
        {filteredRepos.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No repositories match your search
          </div>
        ) : (
          filteredRepos.map((repo) => {
            const isSelected = selectedRepoUrl === repo.html_url
            
            return (
              <button
              type='button'
                key={repo.id}
                onClick={() => handleSelectRepo(repo)}
                className={`w-full text-left rounded-lg border p-3 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 truncate">
                        {repo.full_name}
                      </span>
                      {repo.private ? (
                        <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                      ) : (
                        <Globe className="h-3 w-3 text-slate-400 shrink-0" />
                      )}
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0 ml-auto" />
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          {repo.language}
                        </span>
                      )}
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Selected Info */}
      {selectedRepoUrl && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-900">
            <span className="font-medium">Selected:</span> {selectedRepoUrl}
          </p>
        </div>
      )}
    </div>
  )
}