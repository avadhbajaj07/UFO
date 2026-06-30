'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === '{}' ? 'An unexpected authentication error occurred. Please try again.' : error.message)
      setLoading(false)
      return
    }

    if (user) {
      // Check if redirect search param is set and isn't just root
      const hasCustomRedirect = searchParams.get('redirect') && searchParams.get('redirect') !== '/'
      if (hasCustomRedirect) {
        router.push(redirect)
      } else {
        // Query user parameters to route to correct dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single() as any

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

  const handleMagicLink = async () => {
    if (!email) {
      setError('Enter your email address first')
      return
    }
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}` },
    })

    setLoading(false)
    if (error) {
      setError(error.message === '{}' ? 'An unexpected authentication error occurred. Please try again.' : error.message)
    } else {
      setMessage('🛸 Magic check link dispatched to your email!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-space-950">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #00FF88, transparent)' }} />
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
          <h1 className="font-display text-4xl tracking-wider text-white mb-2">SIGN IN</h1>
          <p className="text-sm text-muted">Welcome back, Commander</p>
        </div>

        <div className="bg-space-800 border border-muted/10 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="p-3 bg-electric-red/10 border border-electric-red/30 rounded-xl text-sm text-electric-red">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-alien-green/10 border border-alien-green/30 rounded-xl text-sm text-alien-green">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
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
              <Link href="/reset-password" className="text-xs text-alien-green hover:text-alien-green/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 shadow-glow-green"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-muted/10" />
            <span className="text-xs text-muted">or</span>
            <div className="flex-1 h-px bg-muted/10" />
          </div>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="btn-outline w-full justify-center py-3 text-sm"
          >
            Send magic link
          </button>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          No account yet?{' '}
          <Link href="/signup" className="text-alien-green hover:text-alien-green/80 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-space-950 text-muted font-mono text-sm">
        INITIATING QUANTUM AUTHENTICATION...
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
