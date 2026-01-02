
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewJourneyForm } from "@/components/ProtectedUiComponents/journeys/new-journey-form";
import { db } from "@/db";
import { githubInstallations } from "@/db/schema"; 
import { eq } from "drizzle-orm";

export default async function NewJourneyPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const installation = await db.query.githubInstallations.findFirst({
    where: eq(githubInstallations.userId, session.user.id),
  });

  const isGitHubAppInstalled = !!installation;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Create new Seed
          </h1>
          <p className="mt-2 text-slate-600">
            Building project is the best way to learn.
          </p>

          <NewJourneyForm installationId={installation?.installationId} githubAppInstalled={isGitHubAppInstalled} />
        </div>
      </main>
    </div>
  );
}