import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../../lib/supabase-server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: signups, error } = await supabase
    .from('signups')
    .select('id, name, email, created_at')
    .order('created_at', { ascending: false })

  if (error) console.error('Failed to fetch signups:', error)

  return <AdminDashboard signups={signups ?? []} />
}
