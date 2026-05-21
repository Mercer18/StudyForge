"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Flame } from 'lucide-react'
import { AuthModal } from './auth-modal'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-1.5 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">StudyForge</span>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthModal initialTab="login">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none outline-none">
              Log in
            </button>
          </AuthModal>
          <AuthModal initialTab="signup">
            <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all border border-primary/20 bg-primary/90 hover:bg-primary text-primary-foreground">
              Sign Up Free
            </Button>
          </AuthModal>
        </div>
      </div>
    </header>
  )
}
