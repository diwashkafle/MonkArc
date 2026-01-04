
import { App } from '@octokit/app'
import { Octokit } from '@octokit/rest'

export function getGitHubApp() {
  const appId = process.env.GITHUB_APP_ID
  const clientId = process.env.GITHUB_APP_CLIENT_ID
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY
  
  // Validate and throw if missing
  if (!appId) {
    throw new Error('GITHUB_APP_ID environment variable is required')
  }
  if (!clientId) {
    throw new Error('GITHUB_APP_CLIENT_ID environment variable is required')
  }
  if (!clientSecret) {
    throw new Error('GITHUB_APP_CLIENT_SECRET environment variable is required')
  }
  if (!privateKey) {
    throw new Error('GITHUB_APP_PRIVATE_KEY environment variable is required')
  }
  
  // Now TypeScript knows they're not undefined
  return new App({
    appId, // string (not string | undefined)
    privateKey, // string (not string | undefined)
    oauth: {
      clientId, // string (not string | undefined)
      clientSecret, // string (not string | undefined)
    },
  })
}

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

export async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  const token = await getInstallationToken(installationId)
  
  return new Octokit({
    auth: token,
  })
}