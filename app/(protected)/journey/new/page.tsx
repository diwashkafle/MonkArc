import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { hasGitHubConnected } from "@/lib/github/github-status";
import { NewJourneyForm } from "@/components/ProtectedUiComponents/journeys/new-journey-form";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SiCodeblocks } from "react-icons/si";

export default async function NewJourneyPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const githubConnected = await hasGitHubConnected(session.user.id);

  let githubUsername: string | null = null;
  if (githubConnected) {
    const githubAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, session.user.id),
        eq(accounts.provider, "github")
      ),
    });

    githubUsername = githubAccount?.providerAccountId || null;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Create new Seed
          </h1>
          <p className="mt-2 text-slate-600">
           Building project is the best way to learn. 
          </p>

          {/* ✅ Pass server data to client form */}
          <NewJourneyForm
            githubConnected={githubConnected}
            githubUsername={githubUsername}
          />
        </div>
      </main>
    </div>
  );
}
