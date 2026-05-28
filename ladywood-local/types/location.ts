import type { CategoryKey } from "../lib/categories"

export type LocationType = CategoryKey

export interface Location {
    id: number
    name: string
    type: LocationType
    lat: number
    lng: number
    address: string | null
    hours: string | null
    notes: string | null
    created_at: string
}
