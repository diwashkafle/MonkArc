import GithubSignInButton  from '@/components/auth/github-signin-button'
import GoogleSignInButton  from '@/components/auth/google-signin-button';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const {error} = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Sign in to MonkArc
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Continue to write your own journey - Arc
          </p>
        </div>

        {/* Error Message */}
        {error === 'OAuthAccountNotLinked' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <div className="text-amber-600">⚠️</div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">
                   Email already in use
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  Please continue with the method you used to create your account.                </p>
                <p className="mt-2 text-xs text-amber-700">
                  💡 Tip: If you signed up with GitHub, use GitHub to sign in. 
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign In Buttons */}
        <div className="space-y-3">
          <GoogleSignInButton />
          <GithubSignInButton />
        </div>

        <p className="text-center text-xs text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}