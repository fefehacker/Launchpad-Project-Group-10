# CLAUDE.md — Ladywood Local

Quick orientation for Claude (and any new human contributor). Full project description lives in `README.md`; this file is the working brief.

## TL;DR

Ladywood Local is a Next.js 14 (App Router) + Supabase + Google Maps app that shows community resources (food banks, community fridges, warm hubs, waste centres) on a map of Birmingham, centred on Ladywood B16. Coursework — EWB Digital Design Challenge 2025–26.

## Critical structural fact

**The real Next.js app is inside `ladywood-local/`.** The repo root contains a `README.md` and some dead leftover folders. Anything you do has to live inside `ladywood-local/` or Next.js won't see it.

```
Launchpad-Project-Group-10/         ← repo root
├── README.md                       ← project description (read first)
├── CLAUDE.md                       ← this file
├── lib/  ⚠️ DEAD                   ← leftover scaffold, do not import from
├── types/  ⚠️ DEAD                 ← leftover scaffold, do not import from
└── ladywood-local/                 ← ✅ the actual Next.js project
    ├── app/
    │   ├── page.tsx                ← orchestrator: state, filtering, layout
    │   └── layout.tsx
    ├── components/
    │   ├── Map.tsx                 ← Google Map + markers + info windows
    │   ├── Sidebar.tsx             ← category filter buttons
    │   └── SearchBar.tsx           ← search input
    ├── lib/
    │   ├── categories.ts           ← ⭐ single source of truth for categories
    │   └── supabase.ts             ← Supabase client
    ├── types/
    │   └── location.ts             ← Location interface (imports CategoryKey)
    ├── Ladywood Constituency (1).kml  ← ~125 markers exported from Google My Maps
    ├── .env.local                  ← ⚠️ never commit (API keys live here)
    └── package.json
```

## Architecture decisions already made

- **4 categories**, defined in `lib/categories.ts`:
  - `food_bank` — both open-access and referral-only
  - `community_fridge` — actual community fridges only
  - `warm_hub` — drop-in community spaces (warm hubs ± food, plus PAYF meal pop-ups)
  - `waste_centre` — Veolia HRCs (recycling + household waste merged into this single category)
- `categories.ts` is the **single source of truth**. Add/rename/recolour a category there and the whole UI (sidebar, map pins, popups) updates. Do NOT hardcode category labels or colours anywhere else.
- `LocationType` in `types/location.ts` is derived from the keys of `CATEGORIES` via `keyof typeof`. Adding a 5th category = one edit.
- **Scope**: Birmingham-wide data (the KML covers far more than B16), but the map defaults its viewport to Ladywood B16 centre.
- **Search is client-side**, not a DB query. ~125 records is small enough that one Supabase fetch on mount + JS `.filter()` per keystroke is faster than round-tripping.
- **State lives in `page.tsx`.** The three child components (Map, Sidebar, SearchBar) are presentational — parent owns `locations`, `activeCategories`, `searchQuery` and computes `filtered` via `useMemo`.

## Current state

**Done:**
- Categories schema (`lib/categories.ts`) and Location type (`types/location.ts`).
- Frontend scaffold: `Map.tsx`, `Sidebar.tsx`, `SearchBar.tsx`, `page.tsx`.
- Filter-by-category + substring-search-on-name-and-address logic in `page.tsx`.
- KML file with ~125 placemarks exported from the source Google My Map.
- Supabase wiring — `page.tsx` fetches from `supabase.from('locations').select('*')` on mount via `useEffect`. `MOCK_LOCATIONS` removed.

**Not done:**
- `npm install` for the new dep `@vis.gl/react-google-maps` (added to `package.json`, not yet installed).
- KML → Supabase data import. The KML is in `ladywood-local/Ladywood Constituency (1).kml`. Categorisation cannot be done by KML pin colour alone — one marker (the Recycling Popup) is mis-coloured. Need a manual pass on name + description.
- `.env.local` with real keys (Google Maps + Supabase).
- Real Google Cloud Map ID — `Map.tsx` currently uses `'DEMO_MAP_ID'`. Fine for dev, replace before deploy.

## How to continue

In rough order:

1. `cd ladywood-local && npm install` to pull `@vis.gl/react-google-maps`.
2. Create `ladywood-local/.env.local` with the three env vars (Google Maps key, Supabase URL, Supabase anon key). All must have the `NEXT_PUBLIC_` prefix.
3. `npm run dev` — confirm the map loads centred on Ladywood (no markers yet — the `locations` table is empty until the KML import is done). If you see "Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", `.env.local` isn't being read (restart the dev server).
4. ✅ `MOCK_LOCATIONS` replaced with a live Supabase fetch in `page.tsx`.
5. Do the KML → Supabase import. Parse the KML in a script, map style colours → category keys (with a manual sanity pass for the mis-coloured Recycling Popup), insert as rows into the `locations` table. Schema is in `README.md`.
6. Create a real Map ID in Google Cloud Console (Map Management) and replace `'DEMO_MAP_ID'` in `Map.tsx`.

## Gotchas to avoid

- **Don't import from the root-level `/lib` or `/types`** — those folders are dead. Use `ladywood-local/lib/...` and `ladywood-local/types/...`.
- **`type` in the Supabase `locations` table must be one of**: `food_bank`, `community_fridge`, `warm_hub`, `waste_centre`. Any other value will crash `<Map>` because `CATEGORIES[loc.type]` will be undefined. Add a CHECK constraint in Postgres if possible.
- **British spelling**: `colour` not `color` throughout (it's a UK uni project, the existing code uses British). Mixing the two will cause confusing bugs.
- **Restrict the Google Maps API key** in Google Cloud Console by HTTP referrer (`localhost:3000/*` for dev, Vercel URL for prod) AND by API (only Maps JavaScript API). An unrestricted key in a public repo is a billing risk even on the free tier.
- **`.env.local` must not be committed.** Default `.gitignore` excludes it; verify with `git status` after creating the file.
- **`node_modules/` is committed to the repo root** (unusual but intentional for this project). If `git pull` fails with "untracked files would be overwritten by merge", delete your local `node_modules/` first (`rm -rf node_modules`) then re-run `git pull`.
- **AdvancedMarker needs a Map ID** on the `<Map>` component. Without one it silently fails to render markers. `DEMO_MAP_ID` works for local dev only.
