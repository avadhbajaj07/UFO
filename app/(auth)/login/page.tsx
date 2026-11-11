'use client'
import { useState, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ADMIN_LOGIN_EMAIL = 'marco.scarpantoni@hotmail.com'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAdminLogin = searchParams.get('admin') === '1'
  const requestedRedirect = searchParams.get('redirect')
  const redirect =
    requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//')
      ? requestedRedirect
      : '/'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Surface any auth callback error from query string
  useEffect(() => {
    const queryError = searchParams.get('error')
    if (queryError) {
      setError(decodeURIComponent(queryError))
    }
  }, [searchParams])

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    setMessage(null)

    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  // Email & Password Sign In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const targetEmail = (isAdminLogin ? ADMIN_LOGIN_EMAIL : email).trim()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password,
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError(
          'Invalid credentials. If you previously registered via Google or Magic Link, please use "Continue with Google" or "Send Magic Link" below.'
        )
      } else {
        setError(
          authError.message === '{}'
            ? 'An unexpected authentication error occurred. Please try again.'
            : authError.message
        )
      }
      setLoading(false)
      return
    }

    if (user) {
      const hasCustomRedirect = redirect !== '/'
      if (hasCustomRedirect) {
        router.push(redirect)
      } else {
        // Query user parameters to route to correct dashboard
        const { data: profile } = (await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()) as any

        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (profile && (profile.role === 'admin' || profile.role === 'super_admin')) {
          router.push('/admin')
        } else if (affiliate) {
          router.push('/affiliate')
        } else {
          router.push('/account')
        }
      }
    } else {
      router.push(redirect)
    }

    setLoading(false)
    router.refresh()
  }

  // Magic Link Sign In
  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address first to receive a sign-in link.')
      return
    }
    setLoading(true)
    setError(null)
    setMessage(null)

    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: callbackUrl,
      },
    })

    setLoading(false)
    if (otpError) {
      setError(
        otpError.message === '{}'
          ? 'An unexpected authentication error occurred. Please try again.'
          : otpError.message
      )
    } else {
      setMessage(`🛸 Magic login link dispatched to ${email}! Click the link in your email to sign in instantly.`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-space-950">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00FF88, transparent)' }}
        />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
            <img
              src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782711478/ufo_logo_sqaure_h2yvkk.jpg"
              alt="UFO LABZ"
              className="w-20 h-20 object-contain rounded-2xl border border-white/10 shadow-lg mx-auto"
            />
          </Link>
          <h1 className="font-display text-4xl tracking-wider text-white mb-2">
            {isAdminLogin ? 'ADMIN SIGN IN' : 'SIGN IN'}
          </h1>
          <p className="text-sm text-muted">
            {redirect.includes('affiliate')
              ? 'Sign in to access your Partner Portal'
              : 'Welcome back, Commander'}
          </p>
        </div>

        <div className="bg-space-800 border border-muted/10 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="p-3 bg-electric-red/10 border border-electric-red/30 rounded-xl text-xs text-electric-red leading-relaxed">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-alien-green/10 border border-alien-green/30 rounded-xl text-xs text-alien-green leading-relaxed">
              {message}
            </div>
          )}

          {!isAdminLogin && (
            <>
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-space-950 font-bold text-xs sm:text-sm hover:bg-gray-100 active:scale-98 transition-all shadow-md disabled:opacity-50"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] text-muted font-mono uppercase tracking-wider">or email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {!isAdminLogin && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="input pl-10 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-xs text-alien-green hover:text-alien-green/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-primary w-full justify-center py-3.5 shadow-glow-green font-bold text-xs uppercase tracking-wider"
            >
              {loading ? 'Signing in…' : 'Sign In with Password'}
            </button>
          </form>

          {!isAdminLogin && (
            <>
              <div className="relative flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[11px] text-muted font-mono uppercase">or passwordless</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading || googleLoading}
                className="btn-outline w-full justify-center py-2.5 text-xs font-mono uppercase tracking-wider text-alien-green border-alien-green/30 hover:border-alien-green/60 hover:bg-alien-green/10"
              >
                Send magic login link
              </button>
            </>
          )}
        </div>

        {!isAdminLogin && (
          <p className="text-center text-sm text-muted mt-6">
            No account yet?{' '}
            <Link
              href={redirect !== '/' ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup'}
              className="text-alien-green hover:text-alien-green/80 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-space-950 text-muted font-mono text-sm">
          INITIATING QUANTUM AUTHENTICATION...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
