export const CATEGORIES = {
  food_bank: {
    label: 'Food Banks',
    emoji: '🥫',
    colour: '#E05C5C',
  },
  community_fridge: {
    label: 'Community Fridges',
    emoji: '🥗',
    colour: '#4CAF7D',
  },
  recycling: {
    label: 'Recycling Points',
    emoji: '♻️',
    colour: '#5B8DD9',
  },
  waste_centre: {
    label: 'Waste Centres',
    emoji: '🏗️',
    colour: '#F5A623',
  },
} as const

export type CategoryKey = keyof typeof CATEGORIES
