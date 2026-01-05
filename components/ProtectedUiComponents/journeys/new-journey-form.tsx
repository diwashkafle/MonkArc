"use client";

import { useEffect, useState } from "react";
import { createJourney } from "@/lib/server-actions/journey-actions";
import { ResourceManager } from "@/components/ProtectedUiComponents/journeys/resource-manager";
import { LinkGitHubButton } from "@/components/ProtectedUiComponents/journeys/github/link-github-button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CancelButton } from "./cancel-button-new-journey";

type Resource = {
  id: string;
  url: string;
  title: string;
  type: "video" | "article" | "docs" | "other" | "course" | "book";
  addedAt: string;
};

interface NewJourneyFormProps {
  githubAppInstalled: boolean;
  installationId?: number;
}

const DRAFT_KEY = "journey-draft";

// Helper function to get initial state
function getInitialFormState() {
  if (typeof window === "undefined") {
    return {
      title: "",
      description: "",
      targetCheckIns: 30,
      startDate: new Date().toISOString().split("T")[0],
      techStack: "",
      isPublic: true,
    };
  }

  const saved = sessionStorage.getItem(DRAFT_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Show toast notification
      setTimeout(() => {
        toast.success("Draft restored!", { duration: 2000 });
      }, 100);
      return parsed.formData;
    } catch (error) {
      console.error("Failed to restore draft:", error);
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }

  // Get today's date in user's timezone
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  return {
    title: "",
    description: "",
    targetCheckIns: 30,
    startDate: todayString,
    techStack: "",
    isPublic: true,
  };
}

function getInitialResources(): Resource[] {
  if (typeof window === "undefined") return [];

  const saved = sessionStorage.getItem(DRAFT_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.resources || [];
    } catch (error) {
      return [];
    }
  }
  return [];
}

function getInitialRepo(): string {
  if (typeof window === "undefined") return "";

  const saved = sessionStorage.getItem(DRAFT_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.selectedRepo || "";
    } catch (error) {
      return "";
    }
  }
  return "";
}

export function NewJourneyForm({
  githubAppInstalled,
  installationId,
}: NewJourneyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize state directly from sessionStorage (no useEffect needed)
  const [formData, setFormData] = useState(getInitialFormState);
  const [resources, setResources] = useState<Resource[]>(getInitialResources);
  const [selectedRepo, setSelectedRepo] = useState<string>(getInitialRepo);

 useEffect(() => {
    if (typeof window === "undefined") return;

    // Debounce to avoid saving on every keystroke
    const timeoutId = setTimeout(() => {
      const draft = {
        formData,
        resources,
        selectedRepo,
        savedAt: new Date().toISOString(),
      };

      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }, 500); // Save 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData, resources, selectedRepo]);

  const hasFormData = () => {
    return (
      formData.title.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.techStack.trim() !== "" ||
      resources.length > 0 ||
      selectedRepo !== ""
    );
  };

  // Clear draft function
  const clearDraft = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(DRAFT_KEY);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSubmit = new FormData(e.currentTarget);
    formDataToSubmit.append("resources", JSON.stringify(resources));

      clearDraft(); // Clear on success

    try {
      await createJourney(formDataToSubmit);
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("Real error:", error);
      toast.error("Error occurred, please try again later");
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
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Building e-commerce to master MERN"
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
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="I want to learn Frontend, Backend, System design and basic of devops to master MERN and fullstack development."
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
          value={formData.targetCheckIns}
          onChange={(e) =>
            setFormData({
              ...formData,
              targetCheckIns: parseInt(e.target.value) || 1,
            })
          }
          className="w-full no-spinner rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="mt-1 text-xs text-slate-500">
          How many days do you want to work on this? (1-365 days)
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
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
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
        <ResourceManager
          initialResources={resources}
          onChange={setResources}
        />
        <p className="mt-2 text-xs text-slate-500">
          {`Add videos, articles, or documentation you're using or learning from
`}
        </p>
      </div>

      {/* GitHub Repo */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          GitHub Repository <span className="text-slate-400">(Optional)</span>
        </label>

        <LinkGitHubButton
          variant="card"
          isInstalled={githubAppInstalled}
          onRepoSelect={(repoUrl) => setSelectedRepo(repoUrl)}
          currentRepo={selectedRepo}
          installationId={installationId}
          redirectSource="new-journey"
        />

        <input type="hidden" name="repoURL" value={selectedRepo} />

        <p className="mt-2 text-xs text-slate-500">
          Install the GitHub App to track commits from your repositories
          (public and private).
        </p>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Tech Stack <span className="text-slate-400">(Optional)</span>
        </label>
        <input
          type="text"
          name="techStack"
          value={formData.techStack}
          onChange={(e) =>
            setFormData({ ...formData, techStack: e.target.value })
          }
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
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
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
        <CancelButton
          hasFormData={hasFormData()}
          onClear={clearDraft}
          isDisabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating</span>
            </div>
          ) : (
            "Create Seed"
          )}
        </button>
      </div>
    </form>
  );
}