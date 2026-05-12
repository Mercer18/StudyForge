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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Forge Background Gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">StudyForge</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">Log out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Subjects</h2>
            <p className="text-muted-foreground mt-1">
              Upload study materials to generate interactive workspaces.
            </p>
          </div>
          <UploadModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject) => (
              <Card key={subject.id} className="flex flex-col h-full relative z-10">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/subject/${subject.id}`} className="flex-1 min-w-0 group cursor-pointer">
                      <CardTitle className="truncate group-hover:text-primary transition-colors" title={subject.title}>{subject.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {subject.description || "Generated learning workspace."}
                      </CardDescription>
                    </Link>
                    <DeleteSubjectButton subjectId={subject.id} />
                  </div>
                </CardHeader>
                <Link href={`/subject/${subject.id}`} className="mt-auto block cursor-pointer">
                  <CardContent>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(subject.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium border ${
                        subject.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        subject.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          ) : (
            <Card className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <CardHeader>
                <CardTitle>No Subjects Yet</CardTitle>
                <CardDescription>Click "Upload Document" to forge your first subject.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
