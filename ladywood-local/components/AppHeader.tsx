'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AppHeader.module.css'

export default function AppHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header} role="banner">
        <div className={styles.brand}>
          <Image
            src="/logo.png"
            alt="Ladywood Local logo"
            width={38}
            height={38}
            className={styles.logo}
            priority
          />
          <div>
            <div className={styles.brandName}>Ladywood Local</div>
            <div className={styles.brandSub}>Find the support you need on your doorstep</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            href="/"
            className={styles.navLink}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Map
          </Link>
          <Link
            href="/faqs"
            className={styles.navLink}
            aria-current={pathname === '/faqs' ? 'page' : undefined}
          >
            FAQs
          </Link>
          <Link
            href="/signup"
            className={styles.navCta}
            aria-current={pathname === '/signup' ? 'page' : undefined}
          >
            Sign up for updates
          </Link>
        </nav>
      </header>
  )
}
