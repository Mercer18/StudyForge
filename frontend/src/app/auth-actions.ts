'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  
  let loginEmail = identifier

  // If identifier doesn't have an @, assume it's a username and resolve it to an email
  if (!identifier.includes('@')) {
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single()

    if (!profile || !profile.email) {
      redirect('/?error=Username not found. Please sign up.')
    }
    loginEmail = profile.email
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: password
  })

  if (error) {
    redirect('/?error=Invalid credentials. Please try again.')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // First, check if username is already taken
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data: existingUser } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (existingUser) {
    redirect('/?error=Username is already taken.')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/?error=' + error.message)
  }

  // Insert into profiles table immediately so we guarantee the username exists
  if (data.user) {
    const { error: upsertError } = await adminSupabase.from('profiles').upsert({
      id: data.user.id,
      email: email,
      username: username
    })
    
    if (upsertError) {
      console.error("Profile creation error:", upsertError)
      redirect('/?error=Account created but profile setup failed. Please log in.')
    }
  }

  revalidatePath('/', 'layout')
  
  // If email confirmation is enabled, they need to check their inbox.
  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
