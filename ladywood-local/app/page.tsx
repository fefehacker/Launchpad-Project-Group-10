'use client'

/**
 * Home page — orchestrates Map + Sidebar + SearchBar.
 *
 * This file is where the frontend meets the backend. The three child
 * components (Map, Sidebar, SearchBar) are presentational — this file
 * owns the data, the filter state, and the search state.
 *
 * ─────────────────────────────────────────────────────────────────────
 * BACKEND DEV TODO  👋
 * ─────────────────────────────────────────────────────────────────────
 *
 *  1. Replace the MOCK_LOCATIONS array below with a Supabase fetch.
 *     The pattern (sketched, not tested):
 *
 *       import { supabase } from '../lib/supabase'
 *       import { useEffect } from 'react'
 *
 *       useEffect(() => {
 *           supabase.from('locations').select('*').then(({ data, error }) => {
 *               if (error) console.error(error)
 *               else if (data) setLocations(data as Location[])
 *           })
 *       }, [])
 *
 *     Then change `useState<Location[]>(MOCK_LOCATIONS)` to
 *     `useState<Location[]>([])` and delete the MOCK_LOCATIONS const.
 *
 *  2. Every row in the `locations` table MUST have `type` set to one of
 *     the four CategoryKey values: 'food_bank', 'community_fridge',
 *     'warm_hub', 'waste_centre'. Anything else will throw at runtime
 *     because <Map> looks up CATEGORIES[loc.type] and that will be
 *     undefined.
 *
 *  3. Required env vars in ladywood-local/.env.local:
 *
 *       NEXT_PUBLIC_SUPABASE_URL=...
 *       NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *       NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
 *
 *     The NEXT_PUBLIC_ prefix is required for Next.js to expose them to
 *     the browser. Restrict the Google key by HTTP referrer in Google
 *     Cloud Console (localhost:3000 for dev, your Vercel URL for prod).
 * ─────────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import { CATEGORIES, type CategoryKey } from '../lib/categories'
import type { Location } from '../types/location'

// TODO(backend): delete once Supabase fetch is wired up. See header comment.
const MOCK_LOCATIONS: Location[] = [
    {
        id: 1,
        name: 'Incredible Surplus: Ladywood',
        type: 'food_bank',
        lat: 52.4774642,
        lng: -1.9277013,
        address: "St John's & St Peter's Church, Darnley Road, Ladywood B16 8TF",
        hours: 'Wed & Fri 12pm–2pm',
        notes: 'Pay-As-You-Feel. Open access, no referral.',
        created_at: '2026-05-28T00:00:00Z',
    },
    {
        id: 2,
        name: 'Birmingham Care Group Community Hub',
        type: 'warm_hub',
        lat: 52.4810946,
        lng: -1.9284055,
        address: 'Units 5 & 6, Magreal Business Park, Freeth Street, B16 0QZ',
        hours: 'Tue–Fri 10am–2pm',
        notes: "Low-cost food from Rick's Café inside the hub.",
        created_at: '2026-05-28T00:00:00Z',
    },
    {
        id: 3,
        name: 'Veolia Household Recycling Centre Tyseley',
        type: 'waste_centre',
        lat: 52.4659,
        lng: -1.8505,
        address: 'Reservoir Road, Tyseley, Birmingham B26 3PE',
        hours: 'See council site',
        notes: 'Household waste + recycling. Booking may be required.',
        created_at: '2026-05-28T00:00:00Z',
    },
]

export default function Home() {
    const [locations] = useState<Location[]>(MOCK_LOCATIONS)
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
