'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('🛰️ Password updated successfully! Redirecting to sign in...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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
          <h1 className="font-display text-3xl tracking-wider text-white mb-2 uppercase">SET NEW PASSWORD</h1>
          <p className="text-xs text-gray-400">Lock in your new orbital security access credentials</p>
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

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Orbital Password"
                className="w-full bg-space-950 border border-muted/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-alien-green/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-alien-green text-space-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? 'STORING NEW PASSWORD...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
