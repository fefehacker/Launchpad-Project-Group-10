export const CATEGORIES = {
    food_bank: {
        label: "Food Bank",
        emoji: "🥫",
        colour: "#9b4a3e50",
        fontColour: "#9B4B3E"
    },
     warm_hub: {
        label: "Warm Hub",
        emoji: "☕",
        colour: "#40668E50",
        fontColour: "#40668E"
    },
    community_fridge: {
        label: "Community Fridge",
        emoji: "🥗",
        colour: "#406E4D50",
        fontColour: "#406E4D"
    },
   
    waste_centre: {
        label: "Waste Centre",
        emoji: "🗑️",
        colour: "#584E9150",
        fontColour: "#584E91"
    }
}

export type CategoryKey = keyof typeof CATEGORIES
