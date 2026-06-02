export type LocationType = 'food_bank' | 'community_fridge' | 'recycling' | 'waste_centre'

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
