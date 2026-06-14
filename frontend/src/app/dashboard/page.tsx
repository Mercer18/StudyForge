import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth-actions'
import { ThemeToggle } from '@/components/theme-toggle'
import { UploadModal } from '@/components/upload-modal'
import { DeleteSubjectButton } from '@/components/delete-subject-button'
import { Logo } from '@/components/logo-mark'
import { 
  LogOut, 
  FolderOpen, 
  Calendar
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/')
  }

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


  // Fetch subjects for this user
  const { data: subjects } = await adminSupabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans transition-all duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Logo size={26} />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeToggle />
            <span className="hidden sm:inline font-mono text-[11px] text-muted-foreground tracking-wide">{user.email}</span>
            <form action={logout}>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-5 sm:px-8 py-12 sm:py-16 relative z-10">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 pb-8 border-b border-border">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Your forge</span>
            <h1 className="mt-3 font-heading font-light text-4xl sm:text-5xl tracking-tight">
              The <span className="italic">library</span>.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
              Upload a PDF, DOCX, or YouTube link — StudyForge presses it into an interactive workspace.
            </p>
          </div>
          <UploadModal />
        </div>

        {/* Subject grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject) => (
              <div
                key={subject.id}
                className="group relative flex flex-col justify-between h-[200px] rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="flex items-start justify-between gap-3">
                  <Link href={`/subject/${subject.id}`} className="min-w-0 flex-1 cursor-pointer">
                    <h3 className="font-heading text-lg tracking-tight truncate group-hover:text-primary transition-colors" title={subject.title.replace(/_/g, ' ')}>
                      {subject.title.replace(/_/g, ' ')}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {subject.description || "Synthesized study workspace."}
                    </p>
                  </Link>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteSubjectButton subjectId={subject.id} />
                  </div>
                </div>

                <Link href={`/subject/${subject.id}`} className="mt-auto cursor-pointer">
                  <div className="flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {new Date(subject.created_at).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        subject.status === 'completed' ? 'bg-emerald-500' :
                        subject.status === 'processing' ? 'bg-amber-500 animate-pulse' :
                        'bg-red-500'
                      }`} />
                      <span className={
                        subject.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                        subject.status === 'processing' ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-500'
                      }>
                        {subject.status}
                      </span>
                    </span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/40 py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="mb-5 grid place-items-center h-14 w-14 rounded-full border border-border text-muted-foreground/70">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl tracking-tight">Nothing forged yet</h3>
              <p className="mt-2 text-sm text-muted-foreground font-mono max-w-xs">
                Your library is empty. Hit <span className="text-foreground">Upload</span> to forge your first workspace.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
