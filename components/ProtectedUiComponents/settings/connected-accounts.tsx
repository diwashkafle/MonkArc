import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
interface ConnectedAccountsProps {
  email: string | null | undefined
  isGitHubConnected: boolean
  githubUsername: string | null
}

export function ConnectedAccounts({ 
  email, 
  isGitHubConnected, 
  githubUsername 
}: ConnectedAccountsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Connected Accounts
      </h2>
      
      <div className="space-y-3">
        {/* Google Account */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
           <FcGoogle/>
            <div>
              <div className="text-sm font-medium text-slate-900">Google</div>
              <div className="text-xs text-slate-500">{email}</div>
            </div>
          </div>
          <StatusBadge connected={true} />
        </div>
        
        {/* GitHub Account */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <FaGithub/>
            <div>
              <div className="text-sm font-medium text-slate-900">GitHub</div>
              <div className="text-xs text-slate-500">
                {isGitHubConnected ? githubUsername : 'Not connected'}
              </div>
            </div>
          </div>
          <StatusBadge connected={isGitHubConnected} />
        </div>
      </div>
      
      <p className="mt-4 text-xs text-slate-500">
        See GitHub Integration section above for detailed connection settings
      </p>
    </div>
  )
}

function StatusBadge({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        Connected
      </div>
    )
  }
  
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
      Not connected
    </div>
  )
}
