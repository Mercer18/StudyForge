"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { cn } from '@/lib/utils'

export function AuthModal({ children, initialTab = 'login' }: { children: React.ReactNode, initialTab?: 'login' | 'signup' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">StudyForge</DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === 'login' ? "Welcome back. Log in to your forge." : "Create a new account to start forging."}
          </DialogDescription>
        </DialogHeader>

        {activeTab === 'login' ? (
          <form className="space-y-4 pt-4" autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email / Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="m@example.com or Mercer18"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
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
            <Button type="submit" formAction={login} className="w-full">
              Log In
            </Button>
          </form>
        ) : (
          <form className="space-y-4 pt-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Mercer18"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
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
            <Button type="submit" formAction={signup} className="w-full">
              Sign Up Free
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
