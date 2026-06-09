# Ladywood Local

> A map-first community resource finder for Ladywood, Birmingham B16.  
> Find food banks, community fridges, warm hubs, and waste centres — no sign-up required.

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

---

## About the Project

Ladywood is the 2nd most deprived constituency in Birmingham. Around 55% of young people in the area live in deprivation (vs 30% nationally), and Birmingham's recycling rate sits at 22% — less than half the national average of 42%. During the 2025 bin strikes, 17,000 tonnes of waste went uncollected across the city.

**Ladywood Local** directly addresses the Food and Waste challenge area of the EWB 2025–26 brief. It gives residents an instant, no-barrier way to find nearby:

| Category | Emoji | Description |
|---|---|---|
| Food Banks | 🥫 | Emergency food provision with referral info |
| Community Fridges | 🥗 | Free food, no referral needed |
| Warm Hubs | ☕ | Drop-in community spaces |
| Waste Centres | 🏗️ | Household waste and bulky item disposal |

The map fills the screen on load. No account. No pop-ups. No friction.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules |
| Map | Google Maps (`@vis.gl/react-google-maps`) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (admin panel) |
| Hosting | Vercel |
| Version Control | Git + GitHub |
| Project Management | Trello (Scrum) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (ask the project lead for `.env.local` values)
- A Google Maps API key with the Maps JavaScript API enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/fefehacker/Launchpad-Project-Group-10.git
cd Launchpad-Project-Group-10/ladywood-local

# 2. Install dependencies
npm install

# 3. Add environment variables (see Environment Variables section)
cp .env.local.example .env.local
# then fill in the values

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
ladywood-local/
├── app/
│   ├── page.tsx                # Root page — state, filtering, layout
│   ├── layout.tsx              # App shell
│   ├── globals.css
│   ├── admin/                  # Protected admin panel
│   ├── faqs/                   # FAQs page
│   └── signup/                 # Mailing list signup
├── components/
│   ├── AppHeader.tsx           # Shared navigation header
│   ├── Map.tsx                 # Google Map + markers + info windows
│   ├── SearchBar.tsx           # Search input
│   └── Sidebar.tsx             # Category filter + search
├── lib/
│   ├── categories.ts           # ⭐ Single source of truth for categories
│   ├── isOpenNow.ts            # Opening hours parser
│   ├── supabase-browser.ts     # Supabase client (browser)
│   └── supabase-server.ts      # Supabase client (server/middleware)
├── types/
│   └── location.ts             # Location TypeScript interface
├── middleware.ts               # Auth guard for /admin routes
├── .env.local                  # ⚠️ Never commit — contains API keys
└── package.json
```

### Key file: `lib/categories.ts`

Single source of truth for every category. The sidebar, map pins, and info windows all derive from this file — adding or renaming a category requires only one edit here.

---

## Database

Hosted on Supabase. Main table: `locations`.

| Column | Type | Notes |
|---|---|---|
| `id` | integer | Primary key, auto-increment |
| `name` | text | Display name of the location |
| `type` | text | One of: `food_bank`, `community_fridge`, `warm_hub`, `waste_centre` |
| `lat` | float8 | Latitude |
| `lng` | float8 | Longitude |
| `address` | text | Full street address |
| `hours` | text | Opening hours (free text) |
| `notes` | text | Access info, referral requirements, etc. |
| `created_at` | timestamptz | Auto-set on insert |

Row Level Security is enabled. The `locations` table is publicly readable (no auth needed) but requires authentication to write.

There is also a `signups` table for mailing list subscribers (columns: `id`, `email`, `name`, `created_at`).

---

## Environment Variables

Create a `.env.local` file inside `ladywood-local/`. **Do not commit this file.**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

See `.env.local.example` for the full list including optional variables.

Get Supabase values from **Supabase Dashboard → Project Settings → API**.  
For Vercel deployment, add them under **Project → Settings → Environment Variables**.

---

## Contributing

This is a group coursework project. Contribution guidelines for the team:

- Use feature branches, never push to `main`
- PRs require at least one teammate review before merging
- Commit messages should follow the format: `type: short description`  
  Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`
- Keep `lib/categories.ts` as the single source of truth — do not hardcode category names or colours elsewhere

---

*Built for the [Engineers Without Borders](https://www.ewb-uk.org/) Digital Design Challenge 2025–26.*
