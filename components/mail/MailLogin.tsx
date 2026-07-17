'use client'

import { FormEvent, useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

export default function MailLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/mail/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not sign in')
      window.location.reload()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07100d] px-5 py-10 text-white">
      <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_15%_20%,rgba(0,255,136,.13),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(155,48,255,.10),transparent_30%)]" />
      <section className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1713]/95 p-7 shadow-2xl shadow-black/40 sm:p-9">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-alien-green text-space-950 shadow-glow-green">
              <Mail size={22} strokeWidth={2.3} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-alien-green">UFO LABZ</p>
              <h1 className="text-xl font-semibold">Business Mail</h1>
            </div>
          </div>
          <ShieldCheck className="text-white/35" size={25} />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">Enter the private dashboard password to manage company email.</p>

        {!configured ? (
          <div className="mt-7 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            Dashboard setup is almost complete. Add <code className="font-mono text-xs">MAIL_DASHBOARD_PASSWORD</code> and <code className="font-mono text-xs">MAIL_SESSION_SECRET</code> in Vercel, then redeploy.
          </div>
        ) : (
          <form className="mt-7" onSubmit={submit}>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50" htmlFor="mail-password">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
              <input
                id="mail-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                className="h-13 w-full rounded-2xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-12 outline-none transition focus:border-alien-green/60 focus:ring-4 focus:ring-alien-green/5"
                placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            <button disabled={loading} className="mt-5 w-full rounded-2xl bg-alien-green px-5 py-3.5 font-semibold text-[#06100c] transition hover:bg-[#45ffa7] disabled:opacity-60">
              {loading ? 'Signing in…' : 'Open mailbox'}
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/30">
          <LockKeyhole size={13} /> Secure 12-hour session
        </div>
      </section>
    </main>
  )
}
