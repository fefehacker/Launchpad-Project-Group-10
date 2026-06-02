export const CATEGORIES = {
  food_bank: {
    label: 'Food Bank',
    emoji: '🥫',
    colour: '#E05C5C',
  },
  community_fridge: {
    label: 'Community Fridge',
    emoji: '🥗',
    colour: '#4CAF7D',
  },
  warm_hub: {
    label: 'Warm Hub',
    emoji: '☕',
    colour: '#9C27B0',
  },
  waste_centre: {
    label: 'Waste Centre',
    emoji: '🏗️',
    colour: '#F5A623',
  },
} as const

export type CategoryKey = keyof typeof CATEGORIES
