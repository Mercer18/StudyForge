import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { UploadModal } from '@/components/upload-modal'
import { DeleteSubjectButton } from '@/components/delete-subject-button'
import { AnimatedLogo } from '@/components/animated-logo'
import { 
  LogOut, 
  FolderOpen, 
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch subjects for this user
  const { data: subjects } = await adminSupabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans transition-all duration-300">
      
      {/* Background Radial Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Sleek Dashboard Header */}
      <header className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <AnimatedLogo size={28} />
            <span className="font-bold text-lg tracking-tight font-heading">StudyForge</span>
            <span className="key-badge uppercase select-none font-mono text-[9px] px-1 py-0 h-4">deck</span>
          </Link>

          {/* Account Console Metrics */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="key-badge select-none uppercase font-mono text-[9px]">user</span>
              <span className="text-xs font-mono text-muted-foreground">{user.email}</span>
            </div>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm" className="h-9 px-3 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer border border-border/80 hover:bg-muted/50 rounded flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" />
                <span>logout</span>
              </Button>
            </form>
          </div>

        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 container mx-auto px-6 py-10 relative z-10 max-w-6xl">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">Subject Library</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-mono mt-1 leading-relaxed">
              Upload files or links to synthesize interactive learning workspaces.
            </p>
          </div>
          <UploadModal />
        </div>

        {/* Workspace Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className="flex flex-col h-[200px] border border-border/80 bg-card/30 hover:border-primary/40 hover:bg-card/50 transition-all duration-300 rounded-lg group shadow-sm justify-between relative overflow-hidden"
              >
                
                {/* Horizontal Active Highlight Bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 to-amber-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <CardHeader className="p-5 pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/subject/${subject.id}`} className="flex-1 min-w-0 group/link cursor-pointer">
                      <CardTitle className="text-base font-extrabold font-heading truncate group-hover/link:text-primary transition-colors leading-snug" title={subject.title}>
                        {subject.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1.5 font-sans leading-relaxed text-muted-foreground">
                        {subject.description || "Synthesized academic document study module."}
                      </CardDescription>
                    </Link>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <DeleteSubjectButton subjectId={subject.id} />
                    </div>
                  </div>
                </CardHeader>

                <Link href={`/subject/${subject.id}`} className="block cursor-pointer p-5 pt-0 mt-auto">
                  <div className="flex items-center justify-between border-t border-border/50 pt-4 text-[10px] font-mono">
                    
                    {/* Date Badge */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{new Date(subject.created_at).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                    </div>

                    {/* Status Dot (Monkeytype indicators) */}
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ring-2 ${
                        subject.status === 'completed' ? 'bg-green-500 ring-green-500/20 animate-pulse' :
                        subject.status === 'processing' ? 'bg-amber-500 ring-amber-500/20 animate-pulse' :
                        'bg-red-500 ring-red-500/20'
                      }`} />
                      <span className={`font-semibold capitalize ${
                        subject.status === 'completed' ? 'text-green-500' :
                        subject.status === 'processing' ? 'text-amber-500' :
                        'text-red-500'
                      }`}>
                        {subject.status}
                      </span>
                    </div>

                  </div>
                </Link>

              </Card>
            ))
          ) : (
            <Card className="col-span-full border-2 border-dashed border-border/70 bg-card/20 py-16 flex flex-col items-center justify-center text-center rounded-xl p-6">
              <div className="p-4 rounded-full bg-muted/30 border border-border mb-4 text-muted-foreground/60">
                <FolderOpen className="w-8 h-8" />
              </div>
              <CardHeader className="p-0 max-w-sm">
                <CardTitle className="text-lg font-bold font-heading text-foreground">No Forged Workspaces</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-mono mt-1">
                  Your list is currently empty. Initialize your library by clicking "Upload Document".
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
