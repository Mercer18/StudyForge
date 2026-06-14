"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams ? searchParams.get('email') : null

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Navbar />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 60%)" }}
      />

      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 sm:p-10 text-center relative z-10 shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
          <Mail className="w-7 h-7" />
        </div>

        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">One more step</span>
        <h1 className="mt-2 font-heading font-light text-4xl tracking-tight">
          Check your <span className="italic text-primary">inbox</span>.
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We sent a confirmation link to<br />
          <span className="text-foreground font-medium">{email || "your email address"}</span>.
        </p>

        <div className="mt-8 space-y-4 text-left">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border text-sm">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground">Click the link in that email to verify your account, then come back and log in.</p>
          </div>

          <Link
            href="/"
            className="group flex items-center justify-center gap-2 w-full h-11 rounded-full border border-border font-mono text-[11px] uppercase tracking-[0.16em] text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </div>

        <p className="mt-8 font-mono text-[11px] text-muted-foreground">
          Didn&apos;t get it? Check spam, or sign up again.
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-xs text-muted-foreground">
        Initializing verify vault...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
