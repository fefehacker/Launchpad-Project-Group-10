'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '../../lib/supabase-browser'
import { addSignup, sendBroadcast } from './actions'
import styles from './admin.module.css'

interface Signup {
  id: string
  name: string | null
  email: string
  created_at: string
}

interface Props {
  signups: Signup[]
}

export default function AdminDashboard({ signups }: Props) {
  const router = useRouter()

  // Add subscriber form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [addStatus, setAddStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [adding, setAdding] = useState(false)

  // Broadcast form
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [sending, setSending] = useState(false)

  const [signingOut, setSigningOut] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim()) return
    setAdding(true)
    setAddStatus(null)

    const result = await addSignup(newEmail, newName)

    if (result.error) {
      setAddStatus({ type: 'error', message: result.error })
    } else {
      setAddStatus({ type: 'success', message: `${newEmail.trim()} added.` })
      setNewName('')
      setNewEmail('')
    }
    setAdding(false)
  }

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return

    const confirmed = window.confirm(
      `Send "${subject}" to ${signups.length} subscriber${signups.length !== 1 ? 's' : ''}?`
    )
    if (!confirmed) return

    setSending(true)
    setSendStatus(null)

    const result = await sendBroadcast(subject, body)

    if (result.error) {
      setSendStatus({ type: 'error', message: result.error })
    } else {
      setSendStatus({ type: 'success', message: `Sent to ${result.sent} subscriber${result.sent !== 1 ? 's' : ''}.` })
      setSubject('')
      setBody('')
    }
    setSending(false)
  }

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className={styles.dashPage}>
      <div className={styles.dashHeader}>
        <div>
          <h1 className={styles.dashTitle}>Mailing list</h1>
          <p className={styles.dashSub}>{signups.length} subscriber{signups.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleSignOut} disabled={signingOut} className={styles.signOutBtn}>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>

      {/* ── Send update ── */}
      <section className={styles.broadcastSection}>
        <h2 className={styles.sectionTitle}>Send update to all subscribers</h2>
        <form onSubmit={handleBroadcast} className={styles.broadcastForm}>
          <div className={styles.broadcastField}>
            <label htmlFor="bc-subject">Subject</label>
            <input
              id="bc-subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. New community fridge opening this Friday"
              required
              className={styles.broadcastInput}
            />
          </div>
          <div className={styles.broadcastField}>
            <label htmlFor="bc-body">Message</label>
            <textarea
              id="bc-body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message here. Subscribers will see their name at the top if they provided one."
              required
              rows={6}
              className={styles.broadcastTextarea}
            />
          </div>
          <div className={styles.broadcastFooter}>
            {sendStatus && (
              <p
                className={sendStatus.type === 'success' ? styles.successMsg : styles.errorMsg}
                role="alert"
              >
                {sendStatus.message}
              </p>
            )}
            <button
              type="submit"
              disabled={sending || signups.length === 0}
              className={styles.sendBtn}
            >
              {sending
                ? 'Sending…'
                : `Send to ${signups.length} subscriber${signups.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </section>

      {/* ── Add subscriber manually ── */}
      <section className={styles.addSection}>
        <h2 className={styles.sectionTitle}>Add subscriber manually</h2>
        <form onSubmit={handleAdd} className={styles.addForm}>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Full name (optional)"
            className={styles.addInput}
          />
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className={styles.addInput}
          />
          <button type="submit" disabled={adding} className={styles.btn}>
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
        {addStatus && (
          <p
            className={addStatus.type === 'success' ? styles.successMsg : styles.errorMsg}
            role="alert"
          >
            {addStatus.message}
          </p>
        )}
      </section>

      {/* ── Subscribers table ── */}
      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>All subscribers</h2>
        {signups.length === 0 ? (
          <p className={styles.emptyState}>No signups yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Signed up</th>
                </tr>
              </thead>
              <tbody>
                {signups.map(s => (
                  <tr key={s.id}>
                    <td>{s.name ?? <span style={{ color: '#9aafa0', fontStyle: 'italic' }}>—</span>}</td>
                    <td>{s.email}</td>
                    <td>{new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
