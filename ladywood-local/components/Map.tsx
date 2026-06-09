'use client'


import { useState } from 'react'
import {
    APIProvider,
    Map as GoogleMap,
    AdvancedMarker,
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

    return (
        <APIProvider apiKey={apiKey}>
            <GoogleMap
                mapId={MAP_ID}
                defaultCenter={LADYWOOD_CENTRE}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: '100%', height: '100%' }}
                onClick={() => setSelectedId(null)}
            >
                {locations.map((loc) => {
                    const cat = CATEGORIES[loc.type]
                    const isSelected = selectedId === loc.id
                    return (
                        <AdvancedMarker
                            key={loc.id}
                            position={{ lat: loc.lat, lng: loc.lng }}
                            onClick={() => setSelectedId(loc.id)}
                        >
                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                {isSelected && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            position: 'absolute',
                                            bottom: 'calc(100% + 8px)',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: '#ffffff',
                                            color: '#111111',
                                            maxWidth: 'min(460px, 85vw)',
                                            minWidth: 'min(280px, 80vw)',
                                            padding: '12px 14px',
                                            fontFamily: 'inherit',
                                            lineHeight: 1.4,
                                            borderRadius: 8,
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                                            zIndex: 1000,
                                            whiteSpace: 'normal',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                background: '#dc2626',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: 4,
                                                padding: '7px 0',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                marginBottom: 12,
                                                textAlign: 'center',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            ✕ Close
                                        </button>

                                        <div style={{
                                            fontSize: 15,
                                            fontWeight: 700,
                                            color: '#111111',
                                            marginBottom: 8,
                                        }}>
                                            {loc.name}
                                        </div>

                                        {loc.address && (
                                            <div style={{ marginBottom: 6 }}>
                                                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888' }}>
                                                    Address
                                                </span>
                                                <div style={{ fontSize: 13, color: '#333333', marginTop: 1 }}>
                                                    {loc.address}
                                                </div>
                                            </div>
                                        )}

                                        {loc.hours && (
                                            <div style={{ marginBottom: 6 }}>
                                                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888' }}>
                                                    Hours
                                                </span>
                                                <div style={{ fontSize: 13, color: '#333333', marginTop: 1 }}>
                                                    {loc.hours}
                                                </div>
                                            </div>
                                        )}

                                        {loc.notes && (
                                            <div>
                                                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888' }}>
                                                    Notes
                                                </span>
                                                <div style={{ fontSize: 13, color: '#333333', marginTop: 1 }}>
                                                    {loc.notes}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

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

                            </div>
                        </AdvancedMarker>
                    )
                })}
            </GoogleMap>
        </APIProvider>
    )
}
