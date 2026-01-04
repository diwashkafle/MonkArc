"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  Check,
  ChevronDown,
  Search,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { saveGitHubRedirectContext } from "@/lib/github/redirect-context";

interface Repo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  private: boolean;
  description?: string;
  language?: string;
}

interface RepoSelectorProps {
  onSelect: (url: string) => void;
  selectedRepo?: string | null;
  installationId?: number;
  redirectSource: "new-journey" | "edit-journey" | "settings";
  journeyId?: string;
}

export function RepoSelector({
  onSelect,
  selectedRepo,
  installationId,
  redirectSource,
  journeyId,
}: RepoSelectorProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/github-app/repos");

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepos(data.repos || []);
    } catch (error) {
      console.error("Failed to load repos:", error);
      setError("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRepos();
    setIsRefreshing(false);
    toast.success("Repository list refreshed!");
  };
  const selectedRepoData = repos.find((r) => r.url === selectedRepo);

  const filteredRepos = repos.filter(
    (repo) =>
      repo.fullName.toLowerCase().includes(search.toLowerCase()) ||
      repo.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your repositories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="font-medium mb-1">No repositories found</p>
        <p className="text-xs mb-3">
          Make sure you granted MonkArc access to at least one repository during
          installation.
        </p>
        {installationId && (
          <a
            href={`https://github.com/settings/installations/${installationId}`}
            className="inline-flex items-center gap-2 text-xs text-amber-700 hover:text-amber-800 font-medium"
          >
            <Settings className="h-3 w-3" />
            Add repositories in GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-left hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedRepoData ? (
              <>
                {selectedRepoData.private ? (
                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                ) : (
                  <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                )}
                <span className="truncate text-slate-900">
                  {selectedRepoData.fullName}
                </span>
                {selectedRepoData.language && (
                  <span className="text-xs text-slate-500">
                    • {selectedRepoData.language}
                  </span>
                )}
              </>
            ) : (
              <span className="text-slate-500">
                Select a repository ({repos.length} available)
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute z-20 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
              {/* Search */}
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search repositories..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredRepos.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500 text-center">
                    No repositories found
                  </div>
                ) : (
                  filteredRepos.map((repo) => (
                    <button
                      key={repo.id}
                      type="button"
                      onClick={() => {
                        onSelect(repo.url);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors"
                    >
                      {repo.private ? (
                        <Lock className="h-4 w-4 text-amber-600 shrink-0" />
                      ) : (
                        <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 truncate">
                            {repo.fullName}
                          </span>
                          {repo.language && (
                            <span className="text-xs text-slate-500 shrink-0">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {repo.description}
                          </p>
                        )}
                      </div>

                      {selectedRepo === repo.url && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-slate-200 p-2">
                <button
                  type="button"
                  onClick={() => {
                    if (redirectSource === "edit-journey" && journeyId) {
                      saveGitHubRedirectContext("edit-journey", journeyId);
                    } else {
                      saveGitHubRedirectContext(redirectSource);
                    }
                    // Open in new tab
                    window.open(
                      `https://github.com/settings/installations/${installationId}`,
                     
                    );

                    // Show message in current tab
                    toast(
                      "Add repositories in the new tab, then come back here to refresh!"
                    );

                    // Auto-refresh repos when window regains focus
                    const handleFocus = () => {
                      loadRepos(); // Refresh repo list
                      toast.success("Repository list refreshed!");
                      window.removeEventListener("focus", handleFocus);
                    };

                    window.addEventListener("focus", handleFocus);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>{`Can't find your repo? Add more repositories`}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                >
                  <svg
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>
                    {isRefreshing ? "Refreshing..." : "Refresh repository list"}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected repo info */}
      {selectedRepoData && (
        <p className="text-xs text-slate-500 flex items-center gap-1">
          {selectedRepoData.private ? (
            <>
              <Lock className="h-3 w-3" />
              Private repository - commits will be tracked
            </>
          ) : (
            <>
              <Globe className="h-3 w-3" />
              Public repository - commits will be tracked
            </>
          )}
        </p>
      )}
    </div>
  );
}
