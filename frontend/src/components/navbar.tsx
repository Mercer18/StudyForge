"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedLogo } from './animated-logo'
import { AuthModal } from './auth-modal'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl rounded-full border border-border/80 bg-background/55 backdrop-blur-xl px-4 sm:px-6 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative bg-gradient-to-r from-amber-500/[0.03] via-primary/[0.03] to-amber-500/[0.03]">
        {/* Glowing border highlight */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-border/50"></span>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <AnimatedLogo size={28} />
          <span className="font-bold text-base sm:text-lg tracking-tight text-foreground font-heading">
            Study<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Forge</span>
          </span>
        </Link>

        {/* Center Navigation Pills (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1 bg-muted/40 border border-border/40 rounded-full p-1 text-[11px] font-mono font-medium">
          <a href="#features" className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all">
            FEATURES
          </a>
          <a href="#demo" className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all">
            INTERACTIVE DEMO
          </a>
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthModal initialTab="login">
            <button className="text-[11px] font-bold font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-muted/50 bg-transparent border-none outline-none">
              LOG IN
            </button>
          </AuthModal>
          <AuthModal initialTab="signup">
            <Button className="rounded-full px-4 h-8 text-[11px] font-bold font-mono shadow-md shadow-primary/10 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all">
              FORGE FREE
            </Button>
          </AuthModal>
        </div>
      </nav>
    </header>
  )
}
