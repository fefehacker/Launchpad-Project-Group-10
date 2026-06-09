'use client'

import styles from './SearchBar.module.css'

interface SearchBarProps {
    value: string
    onChange: (next: string) => void
    placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search by name or address…' }: SearchBarProps) {
    return (
        <div className={styles.wrapper}>
            <span className={styles.icon} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </span>
            <input
                className={styles.input}
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={placeholder}
            />
        </div>
    )
}