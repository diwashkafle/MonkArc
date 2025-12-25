export interface GitHubCommit {
  sha: string
  message: string
  author: string
  url: string
  date?: string
  verified?: boolean
}

// Type for the githubCommits field in dailyProgress
export type GitHubCommits = GitHubCommit[] | null
