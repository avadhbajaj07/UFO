'use client'
// app/(auth)/signup/page.tsx
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function SignupPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:            { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-space-950">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-alien-green/10 border border-alien-green/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🛸</span>
          </div>
          <h2 className="font-display text-3xl tracking-wider text-white mb-3">CHECK YOUR EMAIL</h2>
          <p className="text-muted text-sm mb-6">
            We've sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click it to activate your UFO LABZ account.
          </p>
          <Link href="/login" className="btn-outline">Back to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-space-950">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #9B30FF, transparent)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center">
              <span className="text-alien-green text-xs font-bold font-mono">U</span>
            </div>
            <span className="font-display text-xl tracking-wider text-white">UFO LABZ</span>
          </Link>
          <h1 className="font-display text-4xl tracking-wider text-white mb-2">JOIN THE CREW</h1>
          <p className="text-sm text-muted">Create your free account and start earning Alien Points</p>
        </div>

        <div className="bg-space-800 border border-muted/10 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="p-3 bg-electric-red/10 border border-electric-red/30 rounded-xl text-sm text-electric-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                required
                className="input pl-10"
                autoComplete="name"
              />
            </div>

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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 characters)"
                required
                minLength={8}
                className="input pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-muted/70">
              By creating an account you agree to our{' '}
              <Link href="/pages/terms" className="text-alien-green hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/pages/privacy" className="text-alien-green hover:underline">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 shadow-glow-green"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-alien-green hover:text-alien-green/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
