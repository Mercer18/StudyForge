"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary animate-bounce duration-3000">
          <Mail className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Check your forge!</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          We've sent a confirmation email to <br />
          <span className="text-foreground font-semibold underline decoration-primary/50 underline-offset-4">{email || "your email address"}</span>.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 text-left p-4 rounded-xl bg-muted/50 border border-border text-sm">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p>Please click the link in the email to verify your account and start forging your study materials.</p>
          </div>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full h-12 rounded-xl group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or try signing up again.
        </p>
      </div>
    </div>
  )
}
