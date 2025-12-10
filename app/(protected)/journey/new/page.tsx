"use client";

import { useState } from "react";
import Link from "next/link";
import { createJourney } from "@/lib/server-actions/journey-actions";
import { ResourceManager } from "@/components/ProtectedUiComponents/resource-manager";

type Resource = {
  id: string
  url: string
  title: string
  type: 'video' | 'article' | 'docs' | 'other'
  addedAt: string
}

export default function NewJourneyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<"learning" | "project">("learning");
  const [resources, setResources] = useState<Resource[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Add resources to form data
    formData.append("resources", JSON.stringify(resources));

    try {
      await createJourney(formData);
      // Action will redirect
    } catch (error) {
      // Check if it's a redirect error
  if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
    // Let it through, don't catch it
    throw error
  }
  
  // Only catch real errors
  console.error('Real error:', error)
  alert(error instanceof Error ? error.message : 'Failed to create journey')
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Journey
          </h1>
          <p className="mt-2 text-slate-600">
            Start a new learning journey or project
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Journey Type */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3">
                Journey Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType("learning")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                    type === "learning"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="text-4xl">📚</div>
                  <div className="font-semibold text-slate-900">
                    Learning Journey
                  </div>
                  <div className="text-xs text-slate-600 text-center">
                    Learn a new skill, language, or topic
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType("project")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                    type === "project"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="text-4xl">💻</div>
                  <div className="font-semibold text-slate-900">Project</div>
                  <div className="text-xs text-slate-600 text-center">
                    Build something, track commits
                  </div>
                </button>
              </div>
              <input type="hidden" name="type" value={type} />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Journey Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                minLength={3}
                maxLength={500}
                placeholder={
                  type === "learning"
                    ? "e.g., Learn React Hooks"
                    : "e.g., Build Todo App"
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                placeholder="What do you want to achieve?"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Target Check-ins */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Target Check-ins <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="targetCheckIns"
                required
                min={7}
                max={365}
                defaultValue={30}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">
                How many days do you want to work on this? (7-365 days)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                required
                min={new Date().toISOString().split("T")[0]}
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">
                When do you want to start this journey?
              </p>
            </div>

            {/* Learning Resources */}
            {type === "learning" && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Learning Resources{" "}
                  <span className="text-slate-400">(Optional)</span>
                </label>
                <ResourceManager
                  initialResources={resources}
                  onChange={setResources}
                />
                <p className="mt-2 text-xs text-slate-500">
                  {`Add videos, articles, or documentation you're learning from`}
                </p>
              </div>
            )}

            {/* GitHub Repo (for projects) */}
            {type === "project" && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  GitHub Repository{" "}
                  <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="repoURL"
                  placeholder="https://github.com/username/repo"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="mt-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs text-blue-900">
                    💡 <strong>Tip:</strong> Add your repo URL to automatically
                    track commits with each check-in.
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {`For private repos, you'll need to add a GitHub token to your environment variables.`}
                  </p>
                </div>
              </div>
            )}

            {/* Tech Stack (for projects) */}
            {type === "project" && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Tech Stack <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="techStack"
                  placeholder="React, TypeScript, Next.js (comma-separated)"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Separate technologies with commas
                </p>
              </div>
            )}

            {/* Privacy */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  defaultChecked={true}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Make this journey public
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Public journeys appear on your profile and the community
                    feed
                  </div>
                </div>
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link
                href="/dashboard"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Journey"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
