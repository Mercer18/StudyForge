import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { WorkspaceClient } from '@/components/workspace-client'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    redirect('/login')
  }

  // Use Admin client to bypass RLS bug for fetching
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch subject
  const { data: subject, error: subjectError } = await adminSupabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single()

  if (subjectError || !subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
        <p className="text-red-500 mb-4 font-mono text-sm">
          DEBUG: {subjectError ? JSON.stringify(subjectError) : "No subject returned"}
        </p>
        <p className="text-muted-foreground mb-4 font-mono text-sm">
          USER ID: {user.id} | SUBJECT ID: {id}
        </p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
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
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h1 className="text-2xl font-bold">Forging Your Workspace...</h1>
        <p className="text-muted-foreground">The AI is currently analyzing your document.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">Back to Dashboard</Button>
        </Link>
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error Loading Workspace Data</h1>
        <p className="text-muted-foreground mb-4">We could not load the AI-generated JSON file.</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="h-14 border-b flex items-center px-4 bg-background/95 backdrop-blur z-10 sticky top-0">
        <Link href="/dashboard" className="mr-4 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-semibold truncate max-w-md">{subject.title}</h1>
      </header>

      {/* Main Workspace Client (Sidebar + Content) */}
      <WorkspaceClient data={studyData} subjectTitle={subject.title} />
    </div>
  )
}
