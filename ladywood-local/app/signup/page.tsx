import Link from 'next/link'
import styles from '../page.module.css'

export default function SignupPage() {
  return (
    <main>
      <header className={styles.appHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/logo.png"
              alt="Ladywood Local logo"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Ladywood Local</div>
              <div style={{ fontSize: 12, color: '#c1c0c0' }}>
                Community resources map
              </div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Home
            </Link>
            <Link href="/signup" style={{ color: '#ffffff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Sign Up
            </Link>
          </nav>
        </div>
        <div style={{ color: '#c1c0c0', fontSize: 14, fontWeight: 600 }}>
          Birmingham
        </div>
      </header>
      <section style={{ color: '#23392C', padding: '32px', maxWidth: 520, border: '3px solid #23392C', borderRadius: 12, margin: '32px auto', background: '#E9FFD8' }}>
        <h1>Sign Up</h1>
        <p>Fill in the form below to be kept up to date with bin days and local events.</p>
        <form style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#333' }}>
            Name
            <input
              type="text"
              name="name"
              placeholder="Your name"
              style={{
                backgroundColor: '#ffffff',
                color: '#333',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #ccc',
                fontSize: 16,
              }}
            />
          </label>
          <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#333' }}>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              style={{
                backgroundColor: '#ffffff',
                color: '#333',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #ccc',
                fontSize: 16,
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              border: 'none',
              backgroundColor: '#23392C',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  )
}
