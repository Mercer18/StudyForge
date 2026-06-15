"use client"

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login, signup } from '@/app/auth-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSearchParams } from 'next/navigation'
import { LogoMark } from './logo-mark'
import { createClient } from '@/utils/supabase/client'

type Tab = 'login' | 'signup' | 'forgot'

const labelCls = "block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2"
const submitCls = "w-full h-11 rounded-full font-mono text-xs uppercase tracking-[0.16em] cursor-pointer"

function ForgotForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6 leading-relaxed">
        If an account exists for{' '}
        <span className="text-foreground font-medium">{email}</span>, a reset link is on its way. Check your inbox (and spam).
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 pt-2">
      <div>
        <label htmlFor="forgot-email" className={labelCls}>Email</label>
        <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
      </div>
      {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
      <Button type="submit" disabled={loading} className={submitCls}>
        {loading ? 'Sending…' : 'Send reset link →'}
      </Button>
    </form>
  )
}

function AuthFormWrapper({
  activeTab,
  error,
  onForgot,
}: {
  activeTab: Tab
  error: string | null
  onForgot: () => void
}) {
  if (activeTab === 'forgot') return <ForgotForm />

  if (activeTab === 'login') {
    return (
      <form className="space-y-5 pt-2" autoComplete="on">
        <div>
          <label htmlFor="identifier" className={labelCls}>Email / Username</label>
          <Input id="identifier" name="identifier" type="text" placeholder="m@example.com or Mercer18" autoComplete="username" required />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Password</label>
            <button type="button" onClick={onForgot} className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
              Forgot?
            </button>
          </div>
          <Input id="login-password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
        <Button type="submit" formAction={login} className={submitCls}>Log in →</Button>
      </form>
    )
  }

  return (
    <form className="space-y-5 pt-2" autoComplete="off">
      <div>
        <label htmlFor="username" className={labelCls}>Username</label>
        <Input id="username" name="username" type="text" placeholder="Mercer18" autoComplete="off" required />
      </div>
      <div>
        <label htmlFor="signup-email" className={labelCls}>Email</label>
        <Input id="signup-email" name="email" type="email" placeholder="m@example.com" autoComplete="off" required />
      </div>
      <div>
        <label htmlFor="signup-password" className={labelCls}>Password</label>
        <Input id="signup-password" name="password" type="password" autoComplete="off" required />
      </div>
      {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
      <Button type="submit" formAction={signup} className={submitCls}>Start forging — free →</Button>
    </form>
  )
}

function SuspendedAuthForm({ activeTab, onForgot }: { activeTab: Tab; onForgot: () => void }) {
  const searchParams = useSearchParams()
  const error = searchParams ? searchParams.get('error') : null
  return <AuthFormWrapper activeTab={activeTab} error={error} onForgot={onForgot} />
}

const HEADER: Record<Tab, { kicker: string; title: React.ReactNode; desc: string }> = {
  login: {
    kicker: 'Welcome back',
    title: <>Back to the <span className="italic text-primary">forge</span>.</>,
    desc: 'Log in to your private library.',
  },
  signup: {
    kicker: 'New account',
    title: <>Start <span className="italic text-primary">forging</span>.</>,
    desc: 'A free account, a private library of workspaces.',
  },
  forgot: {
    kicker: 'Reset',
    title: <>Forgot your <span className="italic text-primary">password</span>?</>,
    desc: "Enter your email and we'll send a reset link.",
  },
}

export function AuthModal({ children, initialTab = 'login' }: { children: React.ReactNode, initialTab?: 'login' | 'signup' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  const h = HEADER[activeTab]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="items-center text-center">
          <LogoMark size={42} className="mb-3" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">{h.kicker}</span>
          <DialogTitle className="font-heading font-light text-3xl tracking-tight mt-1">{h.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">{h.desc}</DialogDescription>
        </DialogHeader>

        <Suspense fallback={<div className="h-44 flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">Loading auth vault…</div>}>
          <SuspendedAuthForm activeTab={activeTab} onForgot={() => setActiveTab('forgot')} />
        </Suspense>

        <div className="text-center mt-5 pt-4 border-t border-border">
          {activeTab === 'forgot' ? (
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
            >
              ← Back to log in
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
            >
              {activeTab === 'login' ? "Need an account? Sign up" : "Already forging? Log in"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
