"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  archived?: boolean; 
  disabled?: boolean; 
  fork?: boolean;
};

export async function fetchUserRepos(): Promise<GitHubRepo[] | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // Get GitHub access token from accounts table
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.userId, session.user.id),
    });

    if (!account?.access_token) {
      throw new Error("GitHub not connected");
    }

    // Fetch repos from GitHub API
    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repos");
    }

    const repos: GitHubRepo[] = await response.json();

    // Filter and sort repos
    return repos
      .filter((repo) => !repo.archived && !repo.disabled)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  } catch (error) {
    console.error("Error fetching repos:", error);
    return null;
  }
}
