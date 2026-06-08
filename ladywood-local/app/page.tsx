'use client'

import { useEffect, useMemo, useState } from 'react'
import AppHeader from '../components/AppHeader'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import { CATEGORIES, type CategoryKey } from '../lib/categories'
import { isOpenNow } from '../lib/isOpenNow'
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
    const [openNow, setOpenNow] = useState(false)
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
            if (openNow && !isOpenNow(loc.hours)) return false
            if (!q) return true
            const inName = loc.name.toLowerCase().includes(q)
            const inAddress = loc.address?.toLowerCase().includes(q) ?? false
            return inName || inAddress
        })
    }, [locations, activeCategories, searchQuery, openNow])

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
            <AppHeader />
            <main id="main-content" className={styles.appMain}>
                <Sidebar
                    activeCategories={activeCategories}
                    onToggleCategory={toggleCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    openNow={openNow}
                    onToggleOpenNow={() => setOpenNow((p) => !p)}
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
