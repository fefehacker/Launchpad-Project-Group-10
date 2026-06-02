'use client'

/**
 * SearchBar component — controlled text input for name/address search.
 *
 * BACKEND HOOKS
 * -------------
 *  - Pure presentational. Parent (app/page.tsx) owns the search string
 *    and decides what to do with it. Current behaviour: substring match
 *    on Location.name and Location.address, case-insensitive, performed
 *    in the parent before the filtered array is passed to <Map>.
 *  - If you later wire this up to a Supabase full-text search instead of
 *    client-side filtering, just have the parent's `onChange` trigger
 *    the query — this component doesn't need to change.
 */

interface SearchBarProps {
    value: string
    onChange: (next: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <input
            type="search"
            placeholder="Search by name or address…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 14,
                border: '1px solid #ccc',
                borderRadius: 6,
                outline: 'none',
                boxSizing: 'border-box',
            }}
        />
    )
}
