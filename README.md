# 🗺️ Ladywood Local

> A map-first community resource finder for Ladywood, Birmingham B16.  
> Find food banks, community fridges, recycling points, and waste centres — no sign-up required.

**EWB Digital Design Challenge 2025–26 · UEA School of Computing Sciences**  
Module: Launchpad Project (1st Years) · Group submission · Due: 11 June 2026

---

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Team](#team)
- [AI Usage Declaration](#ai-usage-declaration)

---

## About the Project

Ladywood is the 2nd most deprived constituency in Birmingham. Around 55% of young people in the area live in deprivation (vs 30% nationally), and Birmingham's recycling rate sits at 22% — less than half the national average of 42%. During the 2025 bin strikes, 17,000 tonnes of waste went uncollected across the city.

**Ladywood Local** directly addresses the Food and Waste challenge area of the EWB 2025–26 brief. It gives residents an instant, no-barrier way to find nearby:

| Category | Emoji | Description |
|---|---|---|
| Food Banks | 🥫 | Emergency food provision with referral info |
| Community Fridges | 🥗 | Free food, no referral needed |
| Recycling Points | ♻️ | Drop-off locations for common materials |
| Waste Centres | 🏗️ | Household waste and bulky item disposal |

The map fills the screen on load. No account. No pop-ups. No friction.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules |
| Map | Leaflet + react-leaflet (OpenStreetMap tiles) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth *(future — not in MVP)* |
| Hosting | Vercel |
| Version Control | Git + GitHub |
| Project Management | Trello (Scrum) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (ask the project lead for `.env.local` values)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ladywood-local.git
cd ladywood-local

# 2. Install dependencies
npm install

# 3. Add environment variables
# Create a file called .env.local in the root — ask the project lead for the values:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Branch workflow

Never push directly to `main`. Always work on a feature branch:

```bash
git checkout -b feature/your-feature-name
# make your changes
git add .
git commit -m "feat: describe what you did"
git push origin feature/your-feature-name
# then open a Pull Request on GitHub
```

---

## Project Structure

```
ladywood-local/
├── app/
│   ├── page.tsx              # Root page — renders LadywoodMapMVP
│   ├── layout.tsx            # App shell
│   └── globals.css
├── components/
│   └── LadywoodMapMVP.jsx    # MVP map component (drop-in, self-contained)
├── lib/
│   ├── categories.ts         # ⭐ Single config object — controls all category labels, emojis & colours
│   └── supabase.ts           # Supabase client initialisation
├── types/
│   └── location.ts           # Shared Location TypeScript interface
├── public/
│   └── icons/                # Map pin icons (if custom)
├── .env.local                # ⚠️ Never commit — contains API keys
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

### Key file: `lib/categories.ts`

This is the single source of truth for every category. Adding a new resource type (e.g. `public_toilet`) only requires adding one entry here — no other files need changing.

```typescript
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
}
```

---

## Database

Hosted on Supabase. Single table: `locations`.

| Column | Type | Notes |
|---|---|---|
| `id` | integer | Primary key, auto-increment |
| `name` | text | Display name of the location |
| `type` | text | One of: `food_bank`, `community_fridge`, `recycling`, `waste_centre` |
| `lat` | float8 | Latitude |
| `lng` | float8 | Longitude |
| `address` | text | Full street address |
| `hours` | text | Opening hours (free text) |
| `notes` | text | Access info, referral requirements, etc. |
| `created_at` | timestamptz | Auto-set on insert |

Row Level Security is enabled. The `locations` table is publicly readable (no auth needed) but requires authentication to write — protecting against spam inserts.

### Swapping mock data for live data

In `LadywoodMapMVP.jsx`, replace the mock `LOCATIONS` array with:

```typescript
const { data: locations } = await supabase.from('locations').select('*')
```

---

## Environment Variables

Create a `.env.local` file in the project root. **Do not commit this file.**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Get these values from **Supabase Dashboard → Project Settings → API**.  
For Vercel deployment, add them under **Project → Settings → Environment Variables**.

---

## Contributing

This is a group coursework project. Contribution guidelines for the team:

- Use feature branches, never push to `main`
- PRs require at least one teammate review before merging
- Commit messages should follow the format: `type: short description`  
  Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`
- Keep `lib/categories.ts` as the single source of truth — do not hardcode category names or colours elsewhere

### Out of scope for MVP (future work)

- [ ] User auth + admin dashboard
- [ ] "Suggest a location" form (Supabase insert)
- [ ] Route planning / directions
- [ ] Multi-language support *(28.6% of Ladywood residents speak English as a second language)*
- [ ] PWA / offline mode
- [ ] Public toilet category

---

## AI Usage Declaration

Claude (claude.ai) was used for:
- Initial component scaffold (`LadywoodMapMVP.jsx`)
- Mock data generation
- Project documentation and README

All AI-generated code was reviewed, understood, and modified by team members before use. No AI output was submitted without human review. This is declared in line with the assignment brief requirements.

---

*Built for the [Engineers Without Borders](https://www.ewb-uk.org/) Digital Design Challenge 2025–26.*