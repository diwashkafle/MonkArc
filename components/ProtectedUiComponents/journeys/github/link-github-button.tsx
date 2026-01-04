"use client";
import { saveGitHubRedirectContext } from "@/lib/github/redirect-context";
import { RepoSelector } from "./repo-selector";
import { CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

interface LinkGitHubButtonProps {
  variant?: "inline" | "card";
  isInstalled: boolean;
  onRepoSelect?: (repoUrl: string) => void;
  currentRepo?: string | null;
  installationId?: number;
  redirectSource: "new-journey" | "edit-journey" | "settings";
  journeyId?: string;
}

export function LinkGitHubButton({
  variant = "inline",
  isInstalled,
  onRepoSelect,
  currentRepo,
  installationId,
  redirectSource,
  journeyId,
}: LinkGitHubButtonProps) {
  // If connected, show repo selector
  if (isInstalled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">GitHub App Installed</span>
        </div>

        {onRepoSelect && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Repository
            </label>
            <RepoSelector
              onSelect={onRepoSelect}
              selectedRepo={currentRepo}
              installationId={installationId}
              redirectSource={redirectSource} 
              journeyId={journeyId}
            />
          </div>
        )}
      </div>
    );
  }

  const InstallLinkGitHub = "https://github.com/apps/monk-arc/installations/new";

  // Not connected - show connect button
  if (variant === "card") {
    return (
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">
            <FaGithub />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">
              Install MonkArc GitHub App
            </h4>
            <p className="text-sm text-blue-800 mt-1">
              Grant read-only access to select repositories for commit tracking
            </p>
            <Link
              href={InstallLinkGitHub}
              className="mt-3 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              onClick={() => {
                if (redirectSource === "edit-journey" && journeyId) {
                  saveGitHubRedirectContext("edit-journey", journeyId);
                } else {
                  saveGitHubRedirectContext(redirectSource);
                }
              }}
            >
              <h1>Click on to add your repos form github</h1>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }


  // Inline variant
  return (
    <Link
      href={InstallLinkGitHub}
      className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      onClick={() => {
        if (redirectSource === "edit-journey" && journeyId) {
          saveGitHubRedirectContext("edit-journey", journeyId);
        } else {
          saveGitHubRedirectContext(redirectSource);
        }
      }}
    >
      <button className="flex items-center gap-2" type="button">
        <FaGithub />
       Click on to add your repos form github
      </button>
    </Link>
  );
}
