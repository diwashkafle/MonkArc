"use client";

import { useState } from "react";
import { Plus, X, ExternalLink } from "lucide-react";
import { nanoid } from "nanoid";
import {
  detectResourceType,
  extractTitleFromUrl,
  getResourceTypeIcon,
} from "@/lib/helper/resource-type-detector";

interface Resource {
  id: string;
  url: string;
  title: string;
  type: "video" | "article" | "docs" | "course" | "book" | "other";
  addedAt: string;
}

interface ResourceManagerProps {
  initialResources?: Resource[];
  onChange: (resources: Resource[]) => void;
}

export function ResourceManager({
  initialResources = [],
  onChange,
}: ResourceManagerProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<Resource["type"]>("article");

  const addResource = () => {
    if (!newUrl.trim()) {
      alert("Please enter a URL");
      return;
    }

    try {
      new URL(newUrl);
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const type = newType;
    const title = newTitle.trim() || extractTitleFromUrl(newUrl);

    const resource: Resource = {
      id: nanoid(),
      url: newUrl,
      title,
      type,
      addedAt: new Date().toISOString(),
    };

    const updated = [...resources, resource];
    setResources(updated);
    onChange(updated);

    // Reset form
    setNewUrl("");
    setNewTitle("");
    setNewType("article");
    setShowForm(false);
  };

  const removeResource = (id: string) => {
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    onChange(updated);
  };

  // Auto-detect type when URL changes
  const handleUrlChange = (url: string) => {
    setNewUrl(url);
    if (url.trim()) {
      const detected = detectResourceType(url);
      setNewType(detected);
    }
  };

  return (
    <div className="space-y-3">
      {/* Resource List */}
      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((resource) => {
            const Icon = getResourceTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="text-xl">
                  <Icon size={20} />
                </div>
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
                    <span className="truncate">
                      {resource.url.length > 50
                        ? resource.url.slice(0, 50) + "..."
                        : resource.url}
                    </span>
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
            );
          })}
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
              onChange={(e) => handleUrlChange(e.target.value)}
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
              Type{" "}
              <span className="text-xs text-slate-500">(auto-detected)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                ["video", "article", "docs", "course", "book", "other"] as const
              ).map((type) => {
                const Icon = getResourceTypeIcon(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewType(type)}
                    className={`rounded-lg border-2 px-2 py-1.5 text-sm  font-medium transition-colors ${
                      newType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Icon size={20} />{" "}
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </button>
                );
              })}
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
                setShowForm(false);
                setNewUrl("");
                setNewTitle("");
                setNewType("article");
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
          Add Resources
        </button>
      )}
    </div>
  );
}
