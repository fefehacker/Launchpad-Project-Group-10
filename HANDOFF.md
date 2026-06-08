# Ladywood Local — Handoff Document

**EWB Digital Design Challenge 2025–26 · UEA Group 10**
Submission deadline: 11 June 2026

---

## What is this?

A Next.js web app that shows community resources (food banks, community fridges, warm hubs, waste centres) on a Google Map centred on Ladywood, Birmingham B16. Anyone can use the map without an account. There is also a mailing list signup and a protected admin panel.

---

## What is built and working

### Public-facing
- **Map page (`/`)** — Google Map with filtered markers, category sidebar, search bar, "Open now" toggle. State lives in `page.tsx`; the three child components (Map, Sidebar, SearchBar) are presentational.
- **Signup page (`/signup`)** — collects name + email, inserts into Supabase `signups` table. Shows success screen on submission. Handles duplicate email gracefully.
- **Shared header (`AppHeader`)** — appears on every page. Active-link highlighting via `usePathname`. "Sign up for updates" pill button.

### Admin panel (`/admin`)
- **Login (`/admin/login`)** — email + password via Supabase Auth `signInWithPassword`. No self-serve registration; the admin account is created manually in the Supabase dashboard.
- **Dashboard (`/admin`)** — lists all mailing list subscribers (name, email, date). Admin can manually add a subscriber. Admin can compose and send an email broadcast to the entire list via Resend.
- **Route protection** — `middleware.ts` checks the Supabase session cookie on every `/admin/*` request and redirects unauthenticated users to `/admin/login`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules |
| Map | `@vis.gl/react-google-maps` + Google Maps JavaScript API |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Email | Resend |
| Hosting | Vercel (recommended) |

---

## Repo layout

```
Launchpad-Project-Group-10/
├── README.md
├── HANDOFF.md                ← this file
├── CLAUDE.md                 ← notes for AI-assisted development
└── ladywood-local/           ← ✅ the actual Next.js project (everything lives here)
    ├── middleware.ts          ← protects /admin routes
    ├── app/
    │   ├── layout.tsx         ← root layout, metadata
    │   ├── page.tsx           ← map page (orchestrator: state, filtering, layout)
    │   ├── globals.css
    │   ├── page.module.css
    │   ├── signup/
    │   │   ├── page.tsx       ← public signup form (client component)
    │   │   └── signup.module.css
    │   └── admin/
    │       ├── page.tsx           ← dashboard (server component, auth-gated)
    │       ├── AdminDashboard.tsx ← dashboard UI (client component)
    │       ├── actions.ts         ← server actions: addSignup, sendBroadcast, signOut
    │       ├── admin.module.css
    │       └── login/
    │           └── page.tsx       ← admin login form
    ├── components/
    │   ├── AppHeader.tsx      ← shared nav bar (all pages)
    │   ├── AppHeader.module.css
    │   ├── Map.tsx            ← Google Map + markers + info windows
    │   ├── Sidebar.tsx        ← category filters + search + open-now toggle
    │   └── SearchBar.tsx      ← search input
    ├── lib/
    │   ├── categories.ts      ← ⭐ single source of truth for categories
    │   ├── supabase.ts        ← anon Supabase client (locations query)
    │   ├── supabase-browser.ts ← browser Supabase client (auth)
    │   ├── supabase-server.ts  ← server Supabase client (cookies)
    │   └── isOpenNow.ts       ← parses hours string, returns boolean
    ├── types/
    │   └── location.ts        ← Location interface
    └── .env.local             ← ⚠️ never commit — see .env.local.example
```

> **Dead folders at the repo root:** `lib/` and `types/` are leftover scaffold. Do not import from them. Always use `ladywood-local/lib/` and `ladywood-local/types/`.

---

## Database (Supabase)

### `locations` table — map pins
| Column | Type | Notes |
|---|---|---|
| `id` | integer | Primary key, auto-increment |
| `name` | text | Display name |
| `type` | text | One of: `food_bank`, `community_fridge`, `warm_hub`, `waste_centre` |
| `lat` | float8 | Latitude |
| `lng` | float8 | Longitude |
| `address` | text | Street address |
| `hours` | text | Opening hours (free text, parsed by `isOpenNow.ts`) |
| `notes` | text | Access info, referral notes, etc. |
| `created_at` | timestamptz | Auto-set |

RLS: publicly readable, no anonymous writes.

### `signups` table — mailing list
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | `gen_random_uuid()` |
| `name` | text | Nullable — not all users provide a name |
| `email` | text | Unique constraint |
| `created_at` | timestamptz | Auto-set |

RLS policies:
- `anon` role: INSERT only (public signup form)
- `authenticated` role: SELECT + INSERT (admin dashboard)

### Admin user
Created manually in Supabase Dashboard → Authentication → Users → Add user. There is no self-serve registration. One account, kept by the project lead.

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in all values. **Never commit `.env.local`.**

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud Console → APIs & Services → Credentials |
| `NEXT_PUBLIC_MAP_ID` | Google Cloud Console → Google Maps Platform → Map Management |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | e.g. `Ladywood Local <updates@yourdomain.com>` — requires a verified domain in Resend |

---

## Running locally

```bash
cd ladywood-local
npm install
# add .env.local (see above)
npm run dev
```

Open http://localhost:3000. The map loads immediately; markers appear once the `locations` table has data.

---

## What still needs doing

### Must-have before submission
- [ ] **KML import** — parse `ladywood-local/Ladywood Constituency (1).kml` (~125 placemarks) into the `locations` Supabase table. A script approach is in `CLAUDE.md`. One marker (the Recycling Popup) is mis-coloured in the KML and needs manual category correction.
- [ ] **Real Map ID** — replace `'DEMO_MAP_ID'` in `Map.tsx` with a real Google Cloud Map ID. Without this, `AdvancedMarker` components silently fail to render in production.
- [ ] **Resend sending domain** — verify a domain in Resend so broadcast emails can be delivered. Until then, `onboarding@resend.dev` only delivers to the Resend account owner.

### Nice to have
- [ ] Unsubscribe link in broadcast emails (currently says "reply to unsubscribe")
- [ ] Admin: delete subscriber from the dashboard
- [ ] Admin: view sent broadcast history
- [ ] "Suggest a location" form (public, inserts a pending row for admin review)
- [ ] Multi-language support — 28.6% of Ladywood residents speak English as a second language

---

## Key gotchas

- **British spelling throughout** — the codebase uses `colour` not `color`. Mixing them causes confusing CSS module bugs.
- **`type` column in `locations` must exactly match a key in `categories.ts`** — any other value crashes `<Map>` because `CATEGORIES[loc.type]` returns undefined.
- **`DEMO_MAP_ID` in production** — `AdvancedMarker` requires a real Map ID. Works in local dev, fails silently in prod.
- **Google Maps API key** — restrict it by HTTP referrer (add your Vercel URL) and by API (Maps JavaScript API only) before going live.
- **`node_modules/` is committed at the repo root** — unusual but intentional. If `git pull` fails with "untracked files would be overwritten", delete your local `node_modules/` first and re-pull.
- **Session cookies** — Supabase Auth uses cookies for the admin session. The `middleware.ts` + `supabase-server.ts` pattern handles cookie refresh automatically; do not replace the server client with the simple anon client in admin routes.

---

## How categories work

`lib/categories.ts` is the **only** place category metadata lives. Adding or renaming a category is one edit there — the sidebar buttons, map pin colours, and info windows all update automatically.

```typescript
// lib/categories.ts
export const CATEGORIES = {
  food_bank:        { label: 'Food Bank',        emoji: '🥫', colour: '...', fontColour: '...' },
  community_fridge: { label: 'Community Fridge',  emoji: '🥗', colour: '...', fontColour: '...' },
  warm_hub:         { label: 'Warm Hub',           emoji: '☕', colour: '...', fontColour: '...' },
  waste_centre:     { label: 'Waste Centre',       emoji: '🗑️', colour: '...', fontColour: '...' },
}
```

`LocationType` in `types/location.ts` is derived from these keys via `keyof typeof CATEGORIES` — no duplicate definitions.

---

## Team

Group 10 — EWB Digital Design Challenge 2025–26, UEA School of Computing Sciences.
