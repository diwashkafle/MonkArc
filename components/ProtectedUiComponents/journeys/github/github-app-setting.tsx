'use client'

import { useState } from 'react'
import { ExternalLink, Settings, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface GitHubAppSettingsProps {
  isInstalled: boolean
  installationId?: number
  repoCount?: number
}

export function GitHubAppSettings({ 
  isInstalled, 
  installationId,
  repoCount 
}: GitHubAppSettingsProps) {
  const [isUninstalling, setIsUninstalling] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const handleUninstall = async () => {
    setIsUninstalling(true)
    
    try {
      const response = await fetch('/api/github-app/uninstall', {
        method: 'POST',
      })
      
      if (response.ok) {
        toast.success('GitHub App uninstalled successfully')
        setIsDialogOpen(false)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        toast.error('Failed to uninstall. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to uninstall. Please try again.')
    } finally {
      setIsUninstalling(false)
    }
  }
  
  if (!isInstalled) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <svg className="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              GitHub App Not Installed
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Install the MonkArc GitHub App to track commits from your repositories automatically.
            </p>
            
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Read-only access to selected repositories</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Automatic commit tracking on check-ins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Works with both public and private repos</span>
              </div>
            </div>
            
            <a
              href="https://github.com/apps/monkarc/installations/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Install GitHub App
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              GitHub App Installed
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              MonkArc has access to {repoCount || 0} {repoCount === 1 ? 'repository' : 'repositories'}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://github.com/settings/installations/${installationId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Manage Repositories
                <ExternalLink className="h-3 w-3" />
              </a>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Uninstall App
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Uninstall GitHub App</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to uninstall the MonkArc GitHub App? This will remove access to all your repositories.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                      <p className="text-sm text-amber-800">
                        <strong>Warning:</strong> Existing journeys with GitHub repos will no longer track commits automatically.
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isUninstalling}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleUninstall}
                      disabled={isUninstalling}
                    >
                      {isUninstalling ? <span className='flex items-center gap-1'><Loader2 className='animate-spin'/> Uninstalling...</span> : 'Uninstall'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg bg-slate-50 p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          <strong>Note:</strong> {`Uninstalling the app will remove MonkArc's access to your repositories. 
          Existing journeys with GitHub repos will no longer track commits automatically.`}
        </p>
      </div>
    </div>
  )
}