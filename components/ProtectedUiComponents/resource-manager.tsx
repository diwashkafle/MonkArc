'use client'

import { useState } from 'react'
import { Plus, X, ExternalLink } from 'lucide-react'
import { nanoid } from 'nanoid'

interface Resource {
  id: string
  url: string
  title: string
  type: 'video' | 'article' | 'docs' | 'other'
  addedAt: string
}

interface ResourceManagerProps {
  initialResources?: Resource[]
  onChange: (resources: Resource[]) => void
}

export function ResourceManager({ initialResources = [], onChange }: ResourceManagerProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [showForm, setShowForm] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<Resource['type']>('article')
  
  const detectType = (url: string): Resource['type'] => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video'
    if (url.includes('docs.') || url.includes('/docs/')) return 'docs'
    return 'article'
  }
  
  const extractTitle = (url: string): string => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.replace('www.', '')
      return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1)
    } catch {
      return 'Resource'
    }
  }
  
  const addResource = () => {
    if (!newUrl.trim()) return
    
    const type = detectType(newUrl)
    const title = newTitle.trim() || extractTitle(newUrl)
    
    const resource: Resource = {
      id: nanoid(),
      url: newUrl,
      title,
      type,
      addedAt: new Date().toISOString(),
    }
    
    const updated = [...resources, resource]
    setResources(updated)
    onChange(updated)
    
    // Reset form
    setNewUrl('')
    setNewTitle('')
    setNewType('article')
    setShowForm(false)
  }
  
  const removeResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id)
    setResources(updated)
    onChange(updated)
  }
  
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return '📺'
      case 'docs': return '📚'
      case 'article': return '📄'
      case 'other': return '🔗'
    }
  }
  
  return (
    <div className="space-y-3">
      {/* Resource List */}
      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="text-xl">{getTypeIcon(resource.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">
                  {resource.title}
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  <span className="truncate">{resource.url}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => removeResource(resource.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Form */}
      {showForm ? (
        <div className="rounded-lg border border-slate-300 bg-white p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resource URL *
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Auto-detected from URL"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <div className="flex gap-2">
              {(['video', 'article', 'docs', 'other'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewType(type)}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    newType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addResource}
              disabled={!newUrl.trim()}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Resource
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setNewUrl('')
                setNewTitle('')
                setNewType('article')
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Learning Resource
        </button>
      )}
    </div>
  )
}