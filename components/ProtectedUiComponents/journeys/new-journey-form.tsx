"use client";

import { useState } from "react";
import Link from "next/link";
import { createJourney } from "@/lib/server-actions/journey-actions";
import { ResourceManager } from "@/components/ProtectedUiComponents/journeys/resource-manager";
import { LinkGitHubButton } from "@/components/ProtectedUiComponents/journeys/link-github-button";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Resource = {
  id: string;
  url: string;
  title: string;
  type: "video" | "article" | "docs" | "other" | "course" | "book";
  addedAt: string;
};

interface NewJourneyFormProps {
  githubConnected: boolean;
  githubUsername?: string | null;
}

export function NewJourneyForm({
  githubConnected,
  githubUsername,
}: NewJourneyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<"learning" | "project">("learning");
  const [resources, setResources] = useState<Resource[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("resources", JSON.stringify(resources));

    try {
      await createJourney(formData);
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("Real error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create journey"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          minLength={3}
          maxLength={500}
          placeholder={`Building e-commerece to master MERN`}
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
          placeholder={`I want to learn Frontend, Backend, System design and basic of devlops to master MERN and fullstack development.`}
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
          min={1}
          max={365}
          defaultValue={30}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="mt-1 text-xs text-slate-500">
          How many days do you want to work on this? (7-365 days)
        </p>
      </div>

      {/* Start Date */}
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

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-3">
          Resources <span className="text-slate-400">(Optional)</span>
        </label>
        <ResourceManager initialResources={resources} onChange={setResources} />
        <p className="mt-2 text-xs text-slate-500">
          {`Add videos, articles, or documentation you're using or learning from`}
        </p>
      </div>

      {/* GitHub Repo (for projects) */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          GitHub Repository <span className="text-slate-400">(Optional)</span>
        </label>
        <input
          type="url"
          name="repoURL"
          placeholder="https://github.com/username/repo"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        {/* GitHub Connection Status */}
        <div className="mt-3">
          {githubConnected ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3 border border-green-200">
              <svg
                className="h-5 w-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <span className="font-medium">GitHub Connected</span>
                {githubUsername && (
                  <span className="text-green-600 ml-1">@{githubUsername}</span>
                )}
                <p className="text-xs text-green-600 mt-0.5">
                  Can access private repositories
                </p>
              </div>
            </div>
          ) : (
            <LinkGitHubButton variant="card" />
          )}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Track commits automatically.{" "}
          {!githubConnected && "Connect GitHub to access private repositories."}
        </p>
      </div>

      {/* Tech Stack (for projects) */}
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
              Public journeys appear on your profile and the community feed
            </div>
          </div>
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Link
          href="/dashboard"
          aria-disabled={isSubmitting}
          tabIndex={isSubmitting ? -1 : 0}
          className={clsx(
            "inline-flex items-center rounded-md px-4 py-2",
            isSubmitting
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-100"
          )}
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin" />{" "}
              <span> Creating</span>
            </div>
          ) : (
            "Create Seed"
          )}
        </button>
      </div>
    </form>
  );
}
