'use client'

import { useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { createSupabaseBrowserClient } from '../../lib/supabase-browser'
import signupStyles from './signup.module.css'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase
      .from('signups')
      .insert({ email: email.trim().toLowerCase(), name: name.trim() || null })

    if (!error) {
      setStatus('success')
    } else if (error.code === '23505') {
      setStatus('duplicate')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <>
        <AppHeader />
        <main id="main-content">
          <div className={signupStyles.pageBody}>
            <div className={signupStyles.card}>
              <div className={signupStyles.successBox}>
                <span className={signupStyles.successIcon}>✓</span>
                <h1>You&apos;re signed up!</h1>
                <p>Thanks{name ? `, ${name}` : ''}. We&apos;ll be in touch with updates for Ladywood.</p>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <main id="main-content">
        <div className={signupStyles.pageBody}>
          <div className={signupStyles.card}>
            <div className={signupStyles.cardHeader}>
              <h1>Stay in the loop</h1>
              <p>Sign up to get updates on bin days, local events, and new community resources in Ladywood.</p>
            </div>

            <form className={signupStyles.form} onSubmit={handleSubmit} noValidate>
              <div className={signupStyles.field}>
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div className={signupStyles.field}>
                <label htmlFor="email">Email address <span className={signupStyles.required}>*</span></label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {status === 'duplicate' && (
                <p className={signupStyles.statusMsg} role="alert" data-type="info">
                  That email is already signed up — no need to register again.
                </p>
              )}
              {status === 'error' && (
                <p className={signupStyles.statusMsg} role="alert" data-type="error">
                  Something went wrong. Please try again in a moment.
                </p>
              )}

              <button
                type="submit"
                className={signupStyles.submitBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Signing up…' : 'Sign me up'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
