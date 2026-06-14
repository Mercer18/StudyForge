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

const labelCls = "block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2"
const submitCls = "w-full h-11 rounded-full font-mono text-xs uppercase tracking-[0.16em] cursor-pointer"

function AuthFormWrapper({
  activeTab,
  error
}: {
  activeTab: 'login' | 'signup'
  error: string | null
}) {
  return (
    <>
      {activeTab === 'login' ? (
        <form className="space-y-5 pt-2" autoComplete="on">
          <div>
            <label htmlFor="identifier" className={labelCls}>Email / Username</label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="m@example.com or Mercer18"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className={labelCls}>Password</label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive text-center">
              {error}
            </p>
          )}
          <Button type="submit" formAction={login} className={submitCls}>
            Log in →
          </Button>
        </form>
      ) : (
        <form className="space-y-5 pt-2" autoComplete="off">
          <div>
            <label htmlFor="username" className={labelCls}>Username</label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Mercer18"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email" className={labelCls}>Email</label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password" className={labelCls}>Password</label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="off"
              required
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive text-center">
              {error}
            </p>
          )}
          <Button type="submit" formAction={signup} className={submitCls}>
            Start forging — free →
          </Button>
        </form>
      )}
    </>
  )
}

function SuspendedAuthForm({ activeTab }: { activeTab: 'login' | 'signup' }) {
  const searchParams = useSearchParams()
  const error = searchParams ? searchParams.get('error') : null
  return <AuthFormWrapper activeTab={activeTab} error={error} />
}

export function AuthModal({ children, initialTab = 'login' }: { children: React.ReactNode, initialTab?: 'login' | 'signup' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="items-center text-center">
          <LogoMark size={42} className="mb-3" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            {activeTab === 'login' ? 'Welcome back' : 'New account'}
          </span>
          <DialogTitle className="font-heading font-light text-3xl tracking-tight mt-1">
            {activeTab === 'login' ? (
              <>Back to the <span className="italic text-primary">forge</span>.</>
            ) : (
              <>Start <span className="italic text-primary">forging</span>.</>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {activeTab === 'login'
              ? "Log in to your private library."
              : "A free account, a private library of workspaces."}
          </DialogDescription>
        </DialogHeader>

        <Suspense fallback={<div className="h-44 flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">Loading auth vault…</div>}>
          <SuspendedAuthForm activeTab={activeTab} />
        </Suspense>

        <div className="text-center mt-5 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            {activeTab === 'login' ? "Need an account? Sign up" : "Already forging? Log in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
