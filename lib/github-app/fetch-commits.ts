
import { getInstallationOctokit } from './client'
import { parseGitHubRepoURL } from '../github/github-client'
import { db } from '@/db'
import { githubInstallations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function fetchCommitsViaApp(
  userId: string, 
  repoURL: string,
  since: string,
  until: string
) {
  // Parse repo URL
  const parsed = parseGitHubRepoURL(repoURL)
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL')
  }
  
  const { owner, repo } = parsed
  
  // Get user's installation
  const installation = await db.query.githubInstallations.findFirst({
    where: eq(githubInstallations.userId, userId),
  })
  
  if (!installation) {
    throw new Error('GitHub App not installed')
  }
  
  // Get Octokit for this installation
  const octokit = await getInstallationOctokit(installation.installationId)
  
  // Fetch commits
  const { data: commits } = await octokit.request(
    'GET /repos/{owner}/{repo}/commits',
    {
      owner,
      repo,
      since,
      until,
    }
  )
  
  return commits.map((commit: any) => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
    url: commit.html_url,
  }))
}