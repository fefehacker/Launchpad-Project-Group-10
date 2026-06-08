'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { createSupabaseServerClient } from '../../lib/supabase-server'

export async function addSignup(email: string, name?: string): Promise<{ error?: string }> {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('signups').insert({
    email: email.trim().toLowerCase(),
    name: name?.trim() || null,
  })

  if (error) {
    if (error.code === '23505') return { error: 'That email is already on the list.' }
    return { error: 'Could not add email. Please try again.' }
  }

  revalidatePath('/admin')
  return {}
}

export async function sendBroadcast(
  subject: string,
  body: string
): Promise<{ sent?: number; error?: string }> {
  const supabase = createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: signups, error: fetchError } = await supabase
    .from('signups')
    .select('name, email')

  if (fetchError) return { error: 'Could not fetch subscribers.' }
  if (!signups?.length) return { error: 'No subscribers on the list yet.' }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL ?? 'Ladywood Local <onboarding@resend.dev>'

  // Resend batch API accepts up to 100 emails per call
  for (let i = 0; i < signups.length; i += 100) {
    const batch = signups.slice(i, i + 100)
    const { error } = await resend.batch.send(
      batch.map(s => ({
        from,
        to: s.email,
        subject,
        html: buildEmailHtml(s.name, body),
      }))
    )
    if (error) return { error: 'Failed to send emails. Check your RESEND_API_KEY.' }
  }

  return { sent: signups.length }
}

function buildEmailHtml(name: string | null, body: string): string {
  const greeting = name ? `Hi ${name},` : 'Hello,'
  const bodyHtml = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px 16px;background:#f7faf8;">
  <div style="background:#23392C;padding:16px 20px;border-radius:8px 8px 0 0;">
    <span style="color:#fff;font-size:18px;font-weight:700;">Ladywood Local</span>
    <span style="color:#a8bfb0;font-size:13px;margin-left:8px;">Community updates · Birmingham</span>
  </div>
  <div style="background:#fff;border:1.5px solid #d4e4d9;border-top:none;border-radius:0 0 8px 8px;padding:28px 24px;">
    <p style="margin:0 0 16px;font-size:15px;">${greeting}</p>
    <div style="font-size:15px;line-height:1.7;color:#2d2d2d;">${bodyHtml}</div>
    <hr style="border:none;border-top:1px solid #edf4f0;margin:28px 0 20px;">
    <p style="font-size:12px;color:#778f80;margin:0;line-height:1.5;">
      You are receiving this because you signed up for updates from Ladywood Local.<br>
      To unsubscribe, reply to this email and we will remove you.
    </p>
  </div>
</body>
</html>`
}

export async function signOut(): Promise<void> {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
}
