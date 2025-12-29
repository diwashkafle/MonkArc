import { auth } from "@/lib/auth";
import {
  getJourneyById,
  isExtendedJourneyStuckInArc,
  isJourneyStuckInArc,
} from "@/lib/queries/journey-queries";
import {
  getJourneyCheckIns,
  hasCheckedInToday,
} from "@/lib/queries/check-in-queries";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArcCelebration } from "@/components/ProtectedUiComponents/journeys/arc-celebration";
import { daysSinceLastCheckIn } from "@/lib/journey/journey-status";
import { CheckInTracker } from "@/components/ProtectedUiComponents/journeys/check-in-tracker";
import { Resource } from "@/lib/validation/journey-validation";
import { ExtendJourney } from "@/components/ProtectedUiComponents/journeys/extend-journey-modal";
import { IoSettingsOutline } from "react-icons/io5";
import { PiNotePencilLight } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { RiVideoFill } from "react-icons/ri";
import { IoIosDocument } from "react-icons/io";
import { CgWebsite } from "react-icons/cg";
import { FaLink } from "react-icons/fa6";
import { FaBook, FaGraduationCap } from "react-icons/fa";
import { JOURNEY_ICONS } from "@/lib/constant/icons";
import { Button } from "@/components/ui/button";
import CompleteButton from "@/components/ProtectedUiComponents/journeys/complete-button";
interface JourneyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JourneyDetailPage({
  params,
  searchParams,
}: JourneyDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const journey = await getJourneyById(id, session.user.id);

  if (!journey) notFound();

  if (journey.completedAt) {
    redirect("/arc/" + id);
  }

  console.log("=== JOURNEY DEBUG ===");
  console.log("Journey ID:", journey.id);
  console.log("Phase:", journey.phase);
  console.log("Status:", journey.status);
  console.log("BecameArcAt:", journey.becameArcAt);
  console.log("CompletedAt:", journey.completedAt);
  console.log("IsExtended:", journey.isExtended);
  console.log("Total Check-ins:", journey.totalCheckIns);
  console.log("Target Check-ins:", journey.targetCheckIns);

  const SeedIcon = JOURNEY_ICONS.seed;
  const ArcIcon = JOURNEY_ICONS.arc;

  const isStuckInArc = await isJourneyStuckInArc(journey.id, session.user.id);
  const isExtendedArcStuck = await isExtendedJourneyStuckInArc(journey.id, session.user.id);

  const searchParamsResolved = await searchParams;
  const showArcModal = searchParamsResolved["became-arc"] === "true";
  const showExtendedModal = searchParamsResolved["should-complete"] === "true";

  if (isStuckInArc && !showArcModal) {
    redirect(`/journey/${journey.id}?became-arc=true`);
  }

  if(isExtendedArcStuck && !showExtendedModal){
    redirect(`/journey/${journey.id}?should-complete=true`)

  }

  // Get check-ins
  const checkIns = await getJourneyCheckIns(id);
  const checkedInToday = await hasCheckedInToday(id);

  const daysSince = daysSinceLastCheckIn(
    journey.lastCheckInDate,
    journey.startDate
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <ArcCelebration
        journeyId={journey.id}
        username={session?.user?.name}
        journeyTitle={journey.title}
        totalCheckIns={journey.totalCheckIns}
        targetCheckIns={journey.targetCheckIns}
      />
      <ExtendJourney
        journeyId={journey.id}
        username={session?.user?.name}
        journeyTitle={journey.title}
        totalCheckIns={journey.totalCheckIns}
        targetCheckIns={journey.targetCheckIns}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Journey Header */}

        {journey.status === "frozen" && (
          <div className="mb-6 rounded-lg border-2 border-blue-400 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">❄️</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900">Journey Frozen</h3>
                <p className="mt-1 text-sm text-blue-800">
                  This journey has been frozen due to {daysSince} days of
                  inactivity. Check in today to unfreeze and resume your
                  progress!
                </p>
                {journey.frozenAt && (
                  <p className="mt-2 text-xs text-blue-700">
                    Frozen on {new Date(journey.frozenAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {journey.status === "dead" && (
          <div className="mb-6 rounded-lg border-2 border-red-400 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💀</div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900">Journey Died</h3>
                <p className="mt-1 text-sm text-red-800">
                  This journey has died after {daysSince} days of inactivity.
                  But it is not over! Check in today to resurrect your journey
                  and start fresh.
                </p>
                {journey.deadAt && (
                  <p className="mt-2 text-xs text-red-700">
                    Died on {new Date(journey.deadAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {journey.status === "active" &&
          daysSince >= 1 &&
          daysSince < 3 &&
          !checkedInToday && (
            <div className="mb-6 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900">{`Don't Break the Chain!`}</h3>
                  <p className="mt-1 text-sm text-yellow-800">
                    {`It is been ${daysSince} ${
                      daysSince === 1 ? "day" : "days"
                    } since your last check-in.`}
                    {daysSince === 2 &&
                      " One more day and your journey will freeze!"}
                    Keep your streak alive by checking in today.
                  </p>
                </div>
              </div>
            </div>
          )}

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {journey.title}
                </h1>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
                  <span>
                    {journey.phase === "seed" ? (
                      <div className="flex gap-1 items-center">
                        <SeedIcon className="h-3.5 w-3.5" /> <span>Seed</span>
                      </div>
                    ) : (
                      <div className="flex gap-1 items-center">
                        <ArcIcon className="h-3.5 w-3.5" /> <span>Arc</span>
                      </div>
                    )}
                  </span>
                  <span>•</span>
                  <span className="capitalize font-medium">
                    {journey.status}
                  </span>
                  {!journey.isPublic && (
                    <>
                      <span>•</span>
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-xs">
                        Private
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-slate-700">{journey.description}</p>

          <div className="mt-8 border-t pt-8">
            <CheckInTracker
              startDate={journey.startDate}
              targetCheckIns={journey.targetCheckIns}
              checkIns={checkIns}
              currentCheckIns={journey.totalCheckIns}
            />
          </div>

          {/* Type-specific info */}
          <div
            className={
              journey.repoURL === null && journey.techStack
                ? ""
                : "mt-6 border-t pt-6"
            }
          >
            {journey.repoURL && (
              <a
                href={journey.repoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                View on GitHub →
              </a>
            )}

            {journey.techStack && journey.techStack.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-slate-600">Tech Stack:</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {journey.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-between items-center gap-3 border-t pt-6">
            <section className="flex items-center gap-3">
              <div>
                {!checkedInToday &&
              (journey.status === "active" ||
                journey.status === "frozen" ||
                journey.status === "extended") && (
                <Link
                  href={`/journey/${id}/check-in`}
                >
                 <Button 
                  className="cursor-pointer"
                  variant={'outline'}>
                   ✓ Check-In Today
                 </Button>
                </Link>
              )}

            {checkedInToday && (
              <div className="rounded-lg bg-emerald-50 px-6 py-3 text-sm font-medium text-emerald-700">
                ✓ Checked in today!
              </div>
            )}
              </div>
              {journey.becameArcAt && 
              <CompleteButton journeyId={journey.id} />
              }
            </section>

            <div>
              <Link href={`/journey/${id}/edit`}>
                <IoSettingsOutline size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Resources Section */}
        {journey.resources && journey.resources.length > 0 && (
          <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Learning Resources
              </h3>
              <Link
                href={`/journey/${journey.id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit Resources
              </Link>
            </div>

            <div className="space-y-3 text-gray-700">
              {journey.resources.map((resource: Resource) => {
                const getTypeIcon = (type: string) => {
                  switch (type) {
                    case "video":
                      return <RiVideoFill />;
                    case "docs":
                      return <IoIosDocument />;
                    case "article":
                      return <CgWebsite />;
                    case "course":
                      return <FaGraduationCap />;
                    case "book":
                      return <FaBook />;
                    case "other":
                    default:
                      return <FaLink />;
                  }
                };

                const getTypeBadge = (type: string) => {
                  switch (type) {
                    case "video":
                      return "bg-red-100 text-red-700";
                    case "docs":
                      return "bg-blue-100 text-blue-700";
                    case "article":
                      return "bg-green-100 text-green-700";
                    default:
                      return "bg-slate-100 text-slate-700";
                  }
                };

                return (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:border-blue-300 hover:shadow-md"
                  >
                    {/* Icon */}
                    <div className="text-3xl shrink-0 mt-1">
                      {getTypeIcon(resource.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${getTypeBadge(
                            resource.type
                          )}`}
                        >
                          {resource.type.charAt(0).toUpperCase() +
                            resource.type.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 truncate mt-1 group-hover:text-slate-600">
                        {resource.url}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                        <span>
                          Added{" "}
                          {new Date(resource.addedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="text-blue-600 group-hover:underline">
                          Open resource →
                        </span>
                      </div>
                    </div>

                    {/* External link icon */}
                    <div className="text-slate-400 group-hover:text-blue-600 shrink-0 mt-2 transition-colors">
                      <svg
                        className="h-5 w-5"
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
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-6 text-sm text-slate-500 pt-4 border-t">
              <div>
                <span className="font-medium text-slate-900">
                  {journey.resources.length}
                </span>{" "}
                {journey.resources.length === 1 ? "resource" : "resources"}
              </div>
              <div>•</div>
              <div className="flex items-center gap-2">
                <span>
                  {
                    journey.resources.filter(
                      (r: { type: string }) => r.type === "video"
                    ).length
                  }{" "}
                  videos
                </span>
                <span>•</span>
                <span>
                  {
                    journey.resources.filter(
                      (r: { type: string }) => r.type === "article"
                    ).length
                  }{" "}
                  articles
                </span>
                <span>•</span>
                <span>
                  {
                    journey.resources.filter(
                      (r: { type: string }) => r.type === "docs"
                    ).length
                  }{" "}
                  docs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Section */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Timeline</h2>
            <div className="text-sm text-slate-600">
              {checkIns.length}{" "}
              {checkIns.length === 1 ? "check-in" : "check-ins"}
            </div>
          </div>

          {checkIns.length === 0 ? (
            <div className="mt-6 text-center flex flex-col items-center py-12">
              <div className="text-6xl">
                <PiNotePencilLight />
              </div>
              <p className="mt-4 text-slate-600">No check-ins yet.</p>
              <p className="mt-1 text-sm text-slate-500">
                Start your journey by checking in today!
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {checkIns.map((checkIn) => {
                const checkInDate = new Date(checkIn.date);
                const formattedDate = checkInDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div
                    key={checkIn.id}
                    className="rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            <SlCalender />
                          </div>
                          <div className="font-semibold text-slate-900">
                            {formattedDate}
                          </div>
                        </div>

                        <div className="mt-4 text-slate-700 ">
                          <p>
                            {checkIn.accomplishment.length > 50
                              ? checkIn.accomplishment.slice(0, 50)
                              : checkIn.accomplishment}
                          </p>
                          <p className="ml-2 text-xs text-slate-500 line-clamp-1">
                            {checkIn.notes}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>{checkIn.wordCount} words</span>
                          {checkIn.commitCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{checkIn.commitCount} commits</span>
                            </>
                          )}
                          {checkIn.editedAt && (
                            <>
                              <span>•</span>
                              <span>Edited</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/journey/${id}/check-in/${checkIn.id}`}
                        className="ml-4 text-sm text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
