
interface AccountInfoProps {
  name: string | null | undefined
  email: string | null | undefined
}

export function AccountInfo({ name, email }: AccountInfoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Account Information
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <div className="text-sm font-medium text-slate-900">Name</div>
            <div className="text-sm text-slate-600 mt-1">
              {name}
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Managed by Google
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <div className="text-sm font-medium text-slate-900">Email</div>
            <div className="text-sm text-slate-600 mt-1">
              {email}
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Managed by Google
          </div>
        </div>
      </div>
    </div>
  )
}