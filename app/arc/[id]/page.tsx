import { auth } from "@/lib/auth";
import { getJourneyById } from "@/lib/queries/journey-queries";
import { getJourneyCheckIns } from "@/lib/queries/check-in-queries";
import { notFound, redirect } from "next/navigation";
import { ArcHeader } from "@/components/PublicComponents/Arc/ArcHeader";
import { ArcStats } from "@/components/PublicComponents/Arc/ArcStats";
import { ArcTimeline } from "@/components/PublicComponents/Arc/ArcTimeline";
import { ArcDaysGrid } from "@/components/PublicComponents/Arc/ArcDaysGrid";
import { Lock } from "lucide-react";
import {
  calculateMissedDays,
  calculateTotalCommits,
  calculateTotalWords,
  calculateJourneyDuration,
  calculateCompletionRate,
  calculateExtendedDays,  // ✅ Added
} from "@/lib/arc/act-stats";
import Link from "next/link";
import ArcNavbar from "@/components/PublicComponents/Arc/ArcNavbar";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

interface ArcPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArcPage({ params }: ArcPageProps) {
  const session = await auth();
  const { id } = await params;

  // Get journey without user check (public page)
  const journey = await getJourneyById(id);

  if (!journey) {
    notFound();
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, journey?.userId),
  });

  // If journey is not completed, redirect to journey page
  if (journey.status !== "completed") {
    redirect(`/journey/${id}`);
  }

  // Check if user is the owner
  const isOwner = session?.user?.id === journey.userId;

  // If private and not owner, show private message
  if (!journey.isPublic && !isOwner) {
    return (
      <main>
        <ArcNavbar IsOwner={isOwner} id={id} />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
              <Lock className="h-10 w-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              This Arc is Private
            </h1>
            <p className="text-slate-600 mb-6">
              This journey has been marked as private by its owner.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              <h1>Go to Dashboard</h1>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Get all check-ins
  const checkIns = await getJourneyCheckIns(id);

  // ✅ Calculate journey duration first (needed for other calculations)
  const journeyDuration = calculateJourneyDuration(
    journey.startDate,
    journey.completedAt!,
    journey.lastCheckInDate  // ✅ Added
  );

  // ✅ Calculate stats
  const missedDays = calculateMissedDays(
    journey.startDate,
    journey.completedAt!,
    journey.lastCheckInDate,  // ✅ Added
    journey.totalCheckIns,
    journey.pausedDays
  );

  const totalCommits = calculateTotalCommits(checkIns);
  const totalWords = calculateTotalWords(checkIns);
  
  const completionRate = calculateCompletionRate(
    journey.totalCheckIns,
    journeyDuration,
    journey.pausedDays
  );

  // ✅ Calculate extended days properly
  const extendedDays = calculateExtendedDays(
    journeyDuration,
    journey.originalTarget || journey.targetCheckIns,
    journey.isExtended
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <ArcNavbar IsOwner={isOwner} id={id} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <ArcHeader
          journey={journey}
          isOwner={isOwner}
          image={user?.image}
          name={user?.name}
          username={user?.username}
        />

        {/* Stats */}
        <ArcStats
          totalCheckIns={journey.totalCheckIns}
          targetCheckIns={journey.targetCheckIns}
          longestStreak={journey.longestStreak}
          missedDays={missedDays}
          totalCommits={totalCommits}
          journeyDuration={journeyDuration}
          completionRate={completionRate}
          totalWords={totalWords}
          pausedDays={journey.pausedDays}
          extendedDays={extendedDays} 
          isExtended={journey.isExtended}
          originalTarget={journey.originalTarget}
        />

        {/* Days Grid */}
        <ArcDaysGrid
          startDate={journey.startDate}
          completedAt={journey.completedAt!}
          checkIns={checkIns}
        />

        {/* Timeline */}
        <ArcTimeline isOwner={isOwner} journeyId={journey.id} checkIns={checkIns} />

        {/* Learning Resources (if any) */}
        {journey.resources && journey.resources.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Learning Resources Used
            </h2>
            <div className="grid gap-3">
              {journey.resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all group"
                >
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 group-hover:text-blue-600">
                      {resource.title}
                    </div>
                    <div className="text-sm text-slate-500 capitalize mt-1">
                      {resource.type}
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-slate-400 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!session ? (
          <div className="rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Track your progress, build streaks, and reach your Arc phase just
              like this one.
            </p>
            <Link
              href="/auth/sign-in"
              className="inline-block px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-xl"
            >
              Start Building Today
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}