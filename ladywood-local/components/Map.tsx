'use client'

/**
 * Map component — renders the Google Map + a marker pin per location.
 *
 * BACKEND HOOKS
 * -------------
 *  - Receives `locations: Location[]` via props. The PARENT is responsible
 *    for fetching from Supabase and filtering (by category / search query)
 *    before passing the array in. This component does no fetching.
 *  - Pin colour + emoji come from CATEGORIES (lib/categories.ts) keyed by
 *    `location.type`. If you add a 5th category later, add it there ONLY —
 *    this component picks it up automatically.
 *
 * REQUIRED ENV VAR (in ladywood-local/.env.local):
 *   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
 *
 * REQUIRED PACKAGE (run once):
 *   npm install @vis.gl/react-google-maps
 *
 * NOTE on `mapId`: AdvancedMarker requires a Map ID. "DEMO_MAP_ID" works
 * for local dev. For production, create one in Google Cloud Console →
 * Map Management and replace the constant below.
 */

import { useState } from 'react'
import {
    APIProvider,
    Map as GoogleMap,
    AdvancedMarker,
    InfoWindow,
} from '@vis.gl/react-google-maps'
import { CATEGORIES } from '../lib/categories'
import type { Location } from '../types/location'

const LADYWOOD_CENTRE = { lat: 52.4796, lng: -1.9269 }
const DEFAULT_ZOOM = 14
const MAP_ID = 'DEMO_MAP_ID'

interface MapProps {
    locations: Location[]
}

export default function Map({ locations }: MapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const [selectedId, setSelectedId] = useState<number | null>(null)

    if (!apiKey) {
        return (
            <div style={{ padding: 20, color: '#b00' }}>
                Missing <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in
                <code> .env.local</code>.
            </div>
        )
    }

    const selected =
        selectedId !== null ? locations.find((l) => l.id === selectedId) : null

    return (
        <APIProvider apiKey={apiKey}>
            <GoogleMap
                mapId={MAP_ID}
                defaultCenter={LADYWOOD_CENTRE}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: '100%', height: '100%' }}
            >
                {locations.map((loc) => {
                    const cat = CATEGORIES[loc.type]
                    return (
                        <AdvancedMarker
                            key={loc.id}
                            position={{ lat: loc.lat, lng: loc.lng }}
                            onClick={() => setSelectedId(loc.id)}
                        >
                            <div
                                style={{
                                    background: cat.fontColour,
                                    borderRadius: '50%',
                                    width: 36,
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                }}
                                aria-label={`${cat.label}: ${loc.name}`}
                            >
                                {cat.emoji}
                            </div>
                        </AdvancedMarker>
                    )
                })}

                {selected && (
                    <InfoWindow
                        position={{ lat: selected.lat, lng: selected.lng }}
                        onCloseClick={() => setSelectedId(null)}
                    >
                        <div style={{ maxWidth: 240, fontSize: 13 }}>
                            <strong>{selected.name}</strong>
                            {selected.address && (
                                <div style={{ marginTop: 4 }}>{selected.address}</div>
                            )}
                            {selected.hours && (
                                <div style={{ marginTop: 4 }}>
                                    <strong>Hours:</strong> {selected.hours}
                                </div>
                            )}
                            {selected.notes && (
                                <div style={{ marginTop: 4 }}>{selected.notes}</div>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </APIProvider>
    )
}
