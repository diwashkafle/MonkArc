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

// FETCH COMMITS FROM GITHUB

export async function fetchGitHubCommits(options: FetchCommitsOptions): Promise<GitHubCommit[]> {
  const { repoURL, since, until } = options
  
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
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MonkArc-App', // GitHub requires User-Agent
      },
      // Cache for 5 minutes to avoid rate limits
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found or is private')
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded')
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

// GET COMMITS FOR A SPECIFIC DATE

export async function getCommitsForDate(repoURL: string, date: string): Promise<GitHubCommit[]> {
  // date should be YYYY-MM-DD
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)
  
  const commits = await fetchGitHubCommits({
    repoURL,
    since: dayStart.toISOString(),
    until: dayEnd.toISOString(),
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