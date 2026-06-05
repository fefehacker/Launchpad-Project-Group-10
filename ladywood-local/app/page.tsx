'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import { CATEGORIES, type CategoryKey } from '../lib/categories'
import { supabase } from '../lib/supabase'
import type { Location } from '../types/location'
import styles from './page.module.css'

export default function Home() {
    const [locations, setLocations] = useState<Location[]>([])

    useEffect(() => {
        supabase.from('locations').select('*').then(({ data, error }) => {
            if (error) console.error(error)
            else if (data) setLocations(data as Location[])
        })
    }, [])
    const [activeCategories, setActiveCategories] = useState<CategoryKey[]>(
        Object.keys(CATEGORIES) as CategoryKey[]
    )
    const [searchQuery, setSearchQuery] = useState('')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const toggleCategory = (key: CategoryKey) => {
        setActiveCategories((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        )
    }

    const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        return locations.filter((loc) => {
            if (!activeCategories.includes(loc.type)) return false
            if (!q) return true
            const inName = loc.name.toLowerCase().includes(q)
            const inAddress = loc.address?.toLowerCase().includes(q) ?? false
            return inName || inAddress
        })
    }, [locations, activeCategories, searchQuery])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
            }}
        >
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
            <main className={styles.appMain}
            >
                <Sidebar
                    activeCategories={activeCategories}
                    onToggleCategory={toggleCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={toggleSidebar}
                />
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                    }}
                >
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Map locations={filtered} />
                    </div>
                </div>
            </main>
        </div>
    )
}
