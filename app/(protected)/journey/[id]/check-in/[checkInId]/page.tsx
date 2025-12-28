import { auth } from "@/lib/auth";
import { getJourneyById } from "@/lib/queries/journey-queries";
import { db } from "@/db";
import { dailyProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, GitCommit, Edit3 } from "lucide-react";
import { GitHubCommit, GitHubCommits } from "@/types/github-commits";
interface CheckInDetailPageProps {
  params: Promise<{
    id: string;
    checkInId: string;
  }>;
}

export default async function CheckInDetailPage({
  params,
}: CheckInDetailPageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id, checkInId } = await params;

  // Get check-in
  const checkIn = await db.query.dailyProgress.findFirst({
    where: eq(dailyProgress.id, checkInId),
  });

  if (!checkIn || checkIn.journeyId !== id) {
    notFound();
  }

  // Verify journey ownership
  const journey = await getJourneyById(id, session.user.id);
  if (!journey) notFound();

  const checkInDate = new Date(checkIn.date);
  const formattedDate = checkInDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Parse GitHub commits if available
  const commits = checkIn.githubCommits as GitHubCommits

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mx-auto pt-6 max-w-4xl px-4">
        {
          !!journey.completedAt ? <Link
          href={`/arc/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Arc
        </Link> : <Link
          href={`/journey/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Journey
        </Link>
        }
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {formattedDate}
                </h1>
              </div>
              <p className="text-sm text-slate-600 ml-11">{journey.title}</p>
            </div>

            <Link
              href={`/journey/${id}/check-in/${checkInId}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          </div>

          {/* Accomplishment - Main Summary */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                What I Built Today
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-6">
              <p className="text-lg text-slate-900 leading-relaxed whitespace-pre-wrap">
                {checkIn.accomplishment}
              </p>
            </div>
          </div>

          {/* Notes - Detailed Progress */}
          {checkIn.notes && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Progress Details
                </h2>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-200/60 p-6">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {checkIn.notes}
                </p>
              </div>
            </div>
          )}

          {/* GitHub Commits */}
          {commits && commits.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  GitHub Activity
                </h2>
                <span className="text-xs text-slate-500">
                  ({commits.length} {commits.length === 1 ? "commit" : "commits"})
                </span>
              </div>

              <div className="space-y-3">
                {commits.map((commit: GitHubCommit) => (
                  <div
                    key={commit.sha}
                    className="rounded-xl border border-slate-200 bg-white p-5 hover:border-purple-200 hover:bg-purple-50/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GitCommit className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 wrap-break-words">
                          {commit.message.split("\n")[0]}
                        </div>
                        {commit.message.split("\n").length > 1 && (
                          <div className="mt-2 text-sm text-slate-600 whitespace-pre-wrap wrap-break-words">
                            {commit.message.split("\n").slice(1).join("\n")}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-medium">{commit.author}</span>
                          <span>•</span>
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                            {commit.sha.slice(0, 7)}
                          </span>
                          <span>•</span>
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No commits fallback */}
          {(!commits || commits.length === 0) && checkIn.commitCount === 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <GitCommit className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  No GitHub commits detected for this day
                </p>
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              {checkIn.commitCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <GitCommit className="h-4 w-4" />
                  <span>
                    <span className="font-medium text-slate-700">{checkIn.commitCount}</span>{" "}
                    {checkIn.commitCount === 1 ? "commit" : "commits"}
                  </span>
                </div>
              )}
              {checkIn.editedAt && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="h-4 w-4" />
                    <span>
                      Edited on {new Date(checkIn.editedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}