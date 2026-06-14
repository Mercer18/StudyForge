"use client"

import Link from 'next/link'
import { Logo } from './logo-mark'
import { AuthModal } from './auth-modal'
import { ThemeToggle } from './theme-toggle'

const NAV = [
  { label: "Method", href: "#method" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo size={26} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <AuthModal initialTab="login">
            <button className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none">
              Log in
            </button>
          </AuthModal>
          <AuthModal initialTab="signup">
            <button className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-4 pr-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
              Start forging
              <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </AuthModal>
        </div>
      </div>
    </header>
  )
}
