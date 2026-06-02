'use client'

import { useEffect, useMemo, useState } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import { CATEGORIES, type CategoryKey } from '../lib/categories'
import { supabase } from '../lib/supabase'
import type { Location } from '../types/location'

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

    const toggleCategory = (key: CategoryKey) => {
        setActiveCategories((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        )
    }

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
        <main
            style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
            }}
        >
            <Sidebar
                activeCategories={activeCategories}
                onToggleCategory={toggleCategory}
            />
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                }}
            >
                <div style={{ padding: 12, borderBottom: '1px solid #e0e0e0' }}>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Map locations={filtered} />
                </div>
            </div>
        </main>
    )
}
