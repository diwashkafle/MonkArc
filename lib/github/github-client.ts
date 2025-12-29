interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      email: string
      date: string
    }
  }
  html_url: string
}

interface FetchCommitsOptions {
  repoURL: string
  since?: string // ISO date string
  until?: string // ISO date string
}

// PARSE GITHUB REPO URL

export function parseGitHubRepoURL(url: string): { owner: string; repo: string } | null {
  // Supports:
  // https://github.com/owner/repo
  // https://github.com/owner/repo.git
  // git@github.com:owner/repo.git
  
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\.]+)/,
    /github\.com:([^\/]+)\/([^\/\.]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace('.git', '')
      }
    }
  }
  
  return null
}

interface FetchCommitsOptions {
  repoURL: string
  since?: string
  until?: string
  userToken?: string
}

export async function fetchGitHubCommits(options: FetchCommitsOptions): Promise<GitHubCommit[]> {
  const { repoURL, since, until, userToken } = options
  
  // Parse repo URL
  const parsed = parseGitHubRepoURL(repoURL)
  
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL')
  }
  
  const { owner, repo } = parsed
  
  // Build API URL
  const baseURL = `https://api.github.com/repos/${owner}/${repo}/commits`
  const params = new URLSearchParams()
  
  if (since) params.append('since', since)
  if (until) params.append('until', until)
  
  const url = `${baseURL}?${params.toString()}`
  
  console.log('Fetching commits from:', url)
  
  // Build headers
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'MonkArc-App',
  }
  
  // PRIORITY: User token > Environment token
  const token = userToken || process.env.GITHUB_TOKEN
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found or is private')
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded')
      }
      if (response.status === 401) {
        throw new Error('GitHub authentication failed - please reconnect your account')
      }
      throw new Error(`GitHub API error: ${response.statusText}`)
    }
    
    const commits: GitHubCommit[] = await response.json()
    return commits
    
  } catch (error) {
    console.error('GitHub API error:', error)
    throw error
  }
}

//UPDATE getCommitsForDate too
export async function getCommitsForDate(
  repoURL: string, 
  date: string,
  userToken?: string
): Promise<GitHubCommit[]> {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)
  
  const commits = await fetchGitHubCommits({
    repoURL,
    since: dayStart.toISOString(),
    until: dayEnd.toISOString(),
    userToken, // ✅ Pass user token
  })
  
  return commits
}

// SUMMARIZE COMMITS

export function summarizeCommits(commits: GitHubCommit[]): {
  count: number
  messages: string[]
  authors: string[]
} {
  return {
    count: commits.length,
    messages: commits.map(c => c.commit.message),
    authors: [...new Set(commits.map(c => c.commit.author.name))],
  }
}