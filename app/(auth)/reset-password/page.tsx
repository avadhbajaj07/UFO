'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('🛸 Secure decryption key link sent to your email!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-space-950">
      {/* Glow backdrop */}
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
          <h1 className="font-display text-3xl tracking-wider text-white mb-2 uppercase">DECRYPT PASSWORD</h1>
          <p className="text-xs text-gray-400">Enter your email to receive recovery instructions</p>
        </div>

        <div className="bg-space-800 border border-muted/10 rounded-2xl p-6 space-y-4 shadow-2xl">
          {error && (
            <div className="p-3 bg-electric-red/10 border border-electric-red/30 rounded-xl text-xs text-electric-red">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-alien-green/10 border border-alien-green/30 rounded-xl text-xs text-alien-green">
              {message}
            </div>
          )}

          <form onSubmit={handleResetRequest} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Commander Email"
                className="w-full bg-space-950 border border-muted/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-alien-green/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-alien-green text-space-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? 'SENDING LINK...' : 'SEND RECOVERY LINK'}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-muted/5">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
