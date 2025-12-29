"use client";
import { Calendar, GitCommit, FileText, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { dailyProgress } from "@/db/schema";
import Link from "next/link";
import { useState } from "react";

type CheckIn = typeof dailyProgress.$inferSelect;

// Define the commit type
interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface ArcTimelineProps {
  checkIns: CheckIn[];
  isOwner: boolean;
  journeyId: string;
}

export function ArcTimeline({
  checkIns,
  isOwner,
  journeyId,
}: ArcTimelineProps) {
  // Track which check-in has commits expanded (by check-in ID)
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());

  const toggleCommits = (checkInId: string) => {
    setExpandedCommits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(checkInId)) {
        newSet.delete(checkInId);
      } else {
        newSet.add(checkInId);
      }
      return newSet;
    });
  };

  if (checkIns.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm text-center">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-slate-600">No check-ins recorded</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Journey Timeline</h2>
        <div className="text-sm text-slate-500">
          {checkIns.length} {checkIns.length === 1 ? "check-in" : "check-ins"}
        </div>
      </div>

      <div className="space-y-6">
        {checkIns.map((checkIn, index) => {
          const checkInDate = new Date(checkIn.date);
          const formattedDate = checkInDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const isFirst = index === 0;
          const isLast = index === checkIns.length - 1;
          const isExpanded = expandedCommits.has(checkIn.id);

          // Parse GitHub commits from JSON
          const commits = checkIn.githubCommits 
            ? (Array.isArray(checkIn.githubCommits) 
                ? checkIn.githubCommits 
                : JSON.parse(checkIn.githubCommits as unknown as string)) as GitHubCommit[]
            : [];

          return (
            <div key={checkIn.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-linear-to-b from-orange-200 to-transparent" />
              )}

              {/* Check-in card */}
              <div className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isFirst
                      ? "bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
                      : "bg-white border-2 border-orange-300"
                  }`}
                >
                  {isFirst ? (
                    <Calendar className="h-5 w-5 text-white" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-5 hover:bg-white hover:border-orange-200 transition-all duration-300">
                  {/* Date and prompt */}
                  <div className="mb-3">
                    {isOwner ? (
                      <Link
                        className="hover:underline font-semibold text-slate-900"
                        href={`/journey/${journeyId}/check-in/${checkIn.id}`}
                      >
                        {formattedDate}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-900">{formattedDate}</span>
                    )}
                    <div className="text-sm text-slate-500 mt-1">
                      {checkIn.promptUsed}
                    </div>
                  </div>

                  {/* Accomplishment text */}
                  <div className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {checkIn.accomplishment}
                  </div>

                  {/* Notes (if any) */}
                  {checkIn.notes && (
                    <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
                      <div className="text-xs font-medium text-blue-700 mb-1">
                        Notes
                      </div>
                      <div className="text-sm text-blue-900 whitespace-pre-wrap">
                        {checkIn.notes}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>{checkIn.wordCount} words</span>
                    </div>

                    {checkIn.commitCount > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <button
                          onClick={() => isOwner && toggleCommits(checkIn.id)}
                          className={`flex items-center gap-1.5 text-emerald-600 ${
                            isOwner ? 'hover:text-emerald-700 cursor-pointer' : ''
                          }`}
                        >
                          <GitCommit className="h-4 w-4" />
                          <span>{checkIn.commitCount} commits</span>
                          {isOwner && (
                            isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          )}
                        </button>
                      </>
                    )}

                    {checkIn.editedAt && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600">Edited</span>
                      </>
                    )}
                  </div>

                  {/* Commits dropdown (only for owner) */}
                  {isOwner && isExpanded && commits.length > 0 && (
                    <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4">
                      <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <GitCommit className="h-4 w-4" />
                        GitHub Commits ({commits.length})
                      </div>
                      <div className="space-y-2">
                        {commits.map((commit) => (
                          <Link
                            key={commit.sha}
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-md bg-white border border-slate-200 p-3 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 group-hover:text-emerald-700 line-clamp-2">
                                  {commit.message}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {commit.author} • {new Date(commit.date).toLocaleString()}
                                </div>
                                <div className="text-xs font-mono text-slate-400 mt-1">
                                  {commit.sha.substring(0, 7)}
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}