'use client'

/**
 * Sidebar component — category filter buttons.
 *
 * BACKEND HOOKS
 * -------------
 *  - Iterates over CATEGORIES (lib/categories.ts) — DO NOT hardcode any
 *    category names, labels, emojis or colours here. Add/rename/recolour
 *    a category in that one file and this sidebar reflects it.
 *  - Reports clicks via `onToggleCategory`. The parent (app/page.tsx)
 *    owns the `activeCategories` state and the filtering logic.
 */

import SearchBar from '../components/SearchBar'
import { CATEGORIES, type CategoryKey } from '../lib/categories'

interface SidebarProps {
    activeCategories: CategoryKey[]
    onToggleCategory: (key: CategoryKey) => void
    searchQuery: string
    onSearchChange: (next: string) => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export default function Sidebar({
    activeCategories,
    onToggleCategory,
    searchQuery,
    onSearchChange,
    isCollapsed,
    onToggleCollapse,
}: SidebarProps) {
    const keys = Object.keys(CATEGORIES) as CategoryKey[]

    return (
        <aside
            style={{
                width: isCollapsed ? 60 : 260,
                padding: 16,
                background: '#fafafa',
                borderRight: '1px solid #e0e0e0',
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
                    <h2 style={{ margin: 0, fontSize: 18 }}>Filters</h2>
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
                    {isCollapsed ? '»' : '«'}
                </button>
            </div>
            {!isCollapsed && (
                <div style={{ marginBottom: 16 }}>
                    <SearchBar value={searchQuery} onChange={onSearchChange} />
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
