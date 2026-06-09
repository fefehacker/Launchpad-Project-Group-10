'use client'


import SearchBar from '../components/SearchBar'
import { CATEGORIES, type CategoryKey } from '../lib/categories'

interface SidebarProps {
    activeCategories: CategoryKey[]
    onToggleCategory: (key: CategoryKey) => void
    searchQuery: string
    onSearchChange: (next: string) => void
    openNow: boolean
    onToggleOpenNow: () => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export default function Sidebar({
    activeCategories,
    onToggleCategory,
    searchQuery,
    onSearchChange,
    openNow,
    onToggleOpenNow,
    isCollapsed,
    onToggleCollapse,
}: SidebarProps) {
    const keys = Object.keys(CATEGORIES) as CategoryKey[]

    return (
        <aside
            className="sidebar"
            style={{
                ['--sidebar-width' as any]: isCollapsed ? '60px' : '260px',
                ['--sidebar-height' as any]: isCollapsed ? '64px' : '50vh',
                padding: 16,
                background: '#fafafa',
                borderRight: '2px solid #e0e0e0',
                overflowY: 'auto',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: isCollapsed ? 'center' : 'stretch',
                transition: 'width 0.25s ease',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    width: '100%',
                    marginBottom: 16,
                }}
            >
                {!isCollapsed && (
                    <h2 style={{ margin: 0, fontSize: 18, color: '#333' }}>Filters</h2>
                )}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    style={{
                        width: 38,
                        height: 38,
                        border: 'none',
                        borderRadius: 10,
                        background: '#23392C',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: 18,
                        fontWeight: 700,
                    }}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!isCollapsed}
                >
                    <span className="collapse-icon-desktop">{isCollapsed ? '»' : '«'}</span>
                    <span className="collapse-icon-mobile">{isCollapsed ? '▲' : '▼'}</span>
                </button>
            </div>
            {!isCollapsed && (
                <div style={{ width: '100%', marginBottom: 16 }}>
                    <SearchBar value={searchQuery} onChange={onSearchChange} />
                </div>
            )}

            {!isCollapsed && (
                <div style={{ width: '100%', marginBottom: 16 }}>
                    <button
                        type="button"
                        className="open-now-toggle"
                        aria-pressed={openNow}
                        onClick={onToggleOpenNow}
                        title="Show only locations that are currently open"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: 14,
                            color: openNow ? 'white' : '#333',
                            fontWeight: 600,
                            borderRadius: 6,
                            border: `2px solid ${openNow ? '#23392C' : '#ccc'}`,
                            background: openNow ? '#23392C' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <span style={{ fontSize: 16 }}>🟢</span>
                        <span>Open now</span>
                    </button>
                </div>
            )}

            {keys.map((key) => {
                const cat = CATEGORIES[key]
                const isActive = activeCategories.includes(key)
                return (
                    <button
                        key={key}
                        onClick={() => onToggleCategory(key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: isCollapsed ? 0 : 8,
                            width: '100%',
                            padding: '8px 12px',
                            marginBottom: 8,
                            background: isActive ? cat.colour : 'white',
                            color: isActive ? cat.fontColour : '#333',
                            border: `2px solid ${cat.fontColour}`,
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 600,
                            textAlign: isCollapsed ? 'center' : 'left',
                        }}
                        aria-pressed={isActive}
                    >
                        <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                        {!isCollapsed && <span>{cat.label}</span>}
                    </button>
                )
            })}
        </aside>
    )
}
