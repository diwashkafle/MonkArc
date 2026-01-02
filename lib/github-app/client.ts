// lib/github-app/client.ts

import { App } from '@octokit/app'
import { Octokit } from '@octokit/rest'

// Initialize GitHub App
export function getGitHubApp() {
  return new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    oauth: {
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    },
  })
}

// Get installation token for accessing repos
export async function getInstallationToken(installationId: number): Promise<string> {
  const app = getGitHubApp()
  
  const response = await app.octokit.request(
    'POST /app/installations/{installation_id}/access_tokens',
    {
      installation_id: installationId,
    }
  )
  
  return response.data.token
}

// Get Octokit instance for an installation
export async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  const token = await getInstallationToken(installationId)
  
  return new Octokit({
    auth: token,
  })
}