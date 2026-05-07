"use server"

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteSubject(subjectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verify ownership before deleting
  const { data: subject } = await adminSupabase
    .from('subjects')
    .select('user_id')
    .eq('id', subjectId)
    .single()
    
  if (!subject || subject.user_id !== user.id) {
    throw new Error("Unauthorized")
  }

  // Delete the subject
  await adminSupabase.from('subjects').delete().eq('id', subjectId)
  
  revalidatePath('/dashboard')
}
