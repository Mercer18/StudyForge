"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Navbar } from '@/components/navbar'
import { Input } from '@/components/ui/input'
import { LockKeyhole, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  // The /auth/callback route sets a recovery session before redirecting here.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setHasSession(!!data.user)
      setChecking(false)
    })
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return setError(error.message)
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 1600)
  }

  const labelCls = "block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Navbar />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 60%)" }}
      />

      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 sm:p-10 relative z-10 shadow-xl animate-in fade-in zoom-in-95 duration-500">
        {checking ? (
          <p className="text-center font-mono text-xs text-muted-foreground animate-pulse py-10">Verifying reset link…</p>
        ) : done ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h1 className="font-heading font-light text-3xl tracking-tight">Password <span className="italic text-primary">updated</span>.</h1>
            <p className="mt-3 text-muted-foreground">Signing you in…</p>
          </div>
        ) : !hasSession ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6 text-destructive">
              <LockKeyhole className="w-7 h-7" />
            </div>
            <h1 className="font-heading font-light text-3xl tracking-tight">Link expired</h1>
            <p className="mt-3 text-muted-foreground">This reset link is invalid or has expired. Request a new one from the login screen.</p>
            <Link href="/" className="group mt-8 inline-flex items-center justify-center gap-2 w-full h-11 rounded-full border border-border font-mono text-[11px] uppercase tracking-[0.16em] text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Reset</span>
            <h1 className="mt-2 mb-7 font-heading font-light text-3xl tracking-tight">Set a new <span className="italic text-primary">password</span>.</h1>

            <div className="space-y-5">
              <div>
                <label htmlFor="new-password" className={labelCls}>New password</label>
                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              <div>
                <label htmlFor="confirm-password" className={labelCls}>Confirm password</label>
                <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
              </div>
              {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.16em] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60">
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
