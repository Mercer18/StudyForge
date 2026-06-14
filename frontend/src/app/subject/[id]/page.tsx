import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { WorkspaceClient } from '@/components/workspace-client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LogoMark } from '@/components/logo-mark'
import { ThemeToggle } from '@/components/theme-toggle'

export const dynamic = 'force-dynamic'

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Validate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/')
  }

  // Use Admin client to bypass RLS bug for fetching
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' })
        }
      }
    }
  )


  // Fetch subject
  const { data: subject, error: subjectError } = await adminSupabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single()

  if (subjectError || !subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-3">404</span>
        <h1 className="font-heading font-light text-4xl tracking-tight mb-3">Subject not found.</h1>
        <p className="text-red-500 mb-2 font-mono text-xs max-w-lg break-all">
          DEBUG: {subjectError ? JSON.stringify(subjectError) : "No subject returned"}
        </p>
        <p className="text-muted-foreground mb-6 font-mono text-xs">
          USER ID: {user.id} | SUBJECT ID: {id}
        </p>
        <Link href="/dashboard" className="rounded-full bg-primary text-primary-foreground px-6 h-10 inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] hover:opacity-90 transition-opacity">
          Back to library
        </Link>
      </div>
    )
  }

  // Ensure it belongs to the user
  if (subject.user_id !== user.id) {
    redirect('/dashboard')
  }

  // If still processing
  if (subject.status !== 'completed' || !subject.study_data_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 45%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 60%)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-7 max-w-sm animate-in fade-in duration-700">
          {/* Forge-ring loader around the seal */}
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl animate-pulse" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-primary" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" strokeDasharray="48 230" strokeLinecap="round" style={{ transformOrigin: "50px 50px", animation: "hero-spin 1.5s linear infinite" }} />
              <circle cx="50" cy="50" r="33" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 9" style={{ transformOrigin: "50px 50px", animation: "hero-spin-rev 8s linear infinite" }} />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <LogoMark size={38} />
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Forging</span>
            <h1 className="font-heading font-light text-3xl tracking-tight">
              Pressing your <span className="italic text-primary">workspace</span>…
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[290px] mx-auto">
              Extracting, chunking, and synthesizing your document into structured knowledge. This usually takes a minute.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border border-border px-6 h-9 inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Back to library
          </Link>
        </div>
      </div>
    )
  }

  // Fetch the JSON from the public URL
  let studyData = null
  try {
    const res = await fetch(subject.study_data_url, { cache: 'no-store' })
    if (res.ok) {
      studyData = await res.json()
    } else {
      throw new Error(`Failed to fetch JSON: ${res.status}`)
    }
  } catch (err) {
    console.error('Failed to load study data:', err)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-3">Error</span>
        <h1 className="font-heading font-light text-4xl tracking-tight mb-3">Couldn&apos;t load the workspace.</h1>
        <p className="text-muted-foreground mb-6 text-sm">The AI-generated study file failed to load.</p>
        <Link href="/dashboard" className="rounded-full bg-primary text-primary-foreground px-6 h-10 inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] hover:opacity-90 transition-opacity">
          Back to library
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-5 sm:px-8 bg-background/70 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center min-w-0 gap-4">
          <Link href="/dashboard" className="shrink-0 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <span className="h-5 w-px bg-border shrink-0" />
          <h1 className="font-heading text-lg tracking-tight truncate max-w-md" title={subject.title.replace(/_/g, ' ')}>
            {subject.title.replace(/_/g, ' ')}
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Workspace Client (Sidebar + Content) */}
      <WorkspaceClient data={studyData} subjectTitle={subject.title} />
    </div>
  )
}
