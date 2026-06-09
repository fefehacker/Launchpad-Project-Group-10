# Ladywood Local — UML Class Diagram

A UML class diagram of the `ladywood-local` Next.js application. Because this is a
React + TypeScript codebase, "classes" model:

- **Domain types / interfaces** (data shapes)
- **React components & pages** (props = attributes, handlers/state = operations)
- **Library & server-action modules** (exported functions = operations)

Stereotypes used: `«interface»` for TS interfaces/types, `«component»` for React UI,
`«page»` for route entry points, `«module»` for function-only modules,
`«server»` for server-only code, `«external»` for third-party services.

```mermaid
classDiagram
    direction LR

    %% ───────────── Domain types ─────────────
    class Location {
        <<interface>>
        +number id
        +string name
        +LocationType type
        +number lat
        +number lng
        +string|null address
        +string|null hours
        +string|null notes
        +string created_at
    }

    class CategoryInfo {
        <<interface>>
        +string label
        +string emoji
        +string colour
        +string fontColour
    }

    class Categories {
        <<module>>
        +CATEGORIES : Record~CategoryKey, CategoryInfo~
        +type CategoryKey
    }

    class LocationType {
        <<type>>
        = CategoryKey
    }

    class Signup {
        <<interface>>
        +string id
        +string|null name
        +string email
        +string created_at
    }

    %% ───────────── Lib modules ─────────────
    class isOpenNow {
        <<module>>
        -DAY_INDEX : Record~DayName, number~
        -parseTime(str) number|null
        -isDayInSpec(spec, dayOfWeek) boolean
        +isOpenNow(hours, now) boolean
    }

    class supabase {
        <<module>>
        +supabase : SupabaseClient
    }
    class supabaseBrowser {
        <<module>>
        +createSupabaseBrowserClient() SupabaseClient
    }
    class supabaseServer {
        <<server module>>
        +createSupabaseServerClient() SupabaseClient
    }

    class adminActions {
        <<server module>>
        +addSignup(email, name) Promise~error~
        +sendBroadcast(subject, body) Promise~sent|error~
        +signOut() Promise~void~
        -buildEmailHtml(name, body) string
    }

    class middleware {
        <<server module>>
        +middleware(request) NextResponse
        +config : { matcher }
    }

    %% ───────────── Shared UI components ─────────────
    class AppHeader {
        <<component>>
        -pathname : string
        +render() JSX
    }

    class SearchBar {
        <<component>>
        +string value
        +onChange(next) void
        +string placeholder
        +render() JSX
    }

    class Sidebar {
        <<component>>
        +CategoryKey[] activeCategories
        +onToggleCategory(key) void
        +string searchQuery
        +onSearchChange(next) void
        +boolean openNow
        +onToggleOpenNow() void
        +boolean isCollapsed
        +onToggleCollapse() void
        +render() JSX
    }

    class MapView {
        <<component>>
        +Location[] locations
        -selectedId : number|null
        +render() JSX
    }

    %% ───────────── Pages ─────────────
    class RootLayout {
        <<page>>
        +metadata : Metadata
        +render(children) JSX
    }

    class Home {
        <<page>>
        -locations : Location[]
        -activeCategories : CategoryKey[]
        -searchQuery : string
        -openNow : boolean
        -sidebarCollapsed : boolean
        -filtered : Location[]
        +toggleCategory(key) void
        +toggleSidebar() void
        +render() JSX
    }

    class SignupPage {
        <<page>>
        -name : string
        -email : string
        -emailError : string|null
        -status : idle|loading|success|error|duplicate
        +handleSubmit(e) Promise
        +render() JSX
    }

    class FaqsPage {
        <<page>>
        -searchQuery : string
        -FAQS / FOODBANK_FAQS / RECYCLE_FAQS / CONTACTS
        +render() JSX
    }

    class AdminPage {
        <<server page>>
        +AdminPage() Promise~JSX~
    }

    class AdminLoginPage {
        <<page>>
        -email : string
        -password : string
        -error : string
        -loading : boolean
        +handleSubmit(e) Promise
        +render() JSX
    }

    class AdminDashboard {
        <<component>>
        +Signup[] signups
        -newName / newEmail / subject / body
        +handleAdd(e) Promise
        +handleBroadcast(e) Promise
        +handleSignOut() Promise
        +render() JSX
    }

    %% ───────────── External services ─────────────
    class SupabaseClient {
        <<external>>
        +from(table)
        +auth
    }
    class Resend {
        <<external>>
        +batch.send(emails)
    }
    class GoogleMaps {
        <<external>>
        APIProvider / Map / AdvancedMarker
    }

    %% ───────────── Relationships ─────────────
    Location ..> LocationType : type
    LocationType ..> Categories : CategoryKey
    Categories *-- CategoryInfo : values

    isOpenNow ..> Location : reads hours

    supabase ..> SupabaseClient : creates
    supabaseBrowser ..> SupabaseClient : creates
    supabaseServer ..> SupabaseClient : creates

    %% Page composition
    RootLayout o-- Home
    Home *-- AppHeader
    Home *-- Sidebar
    Home *-- MapView
    Sidebar *-- SearchBar
    FaqsPage *-- AppHeader
    FaqsPage *-- SearchBar
    SignupPage *-- AppHeader
    AdminPage o-- AdminDashboard

    %% Data dependencies
    Home ..> Location : holds
    Home ..> Categories : filters by
    Home ..> isOpenNow : openNow filter
    Home ..> supabase : fetch locations
    MapView ..> Location : renders markers
    MapView ..> Categories : marker style
    MapView ..> GoogleMaps : uses
    Sidebar ..> Categories : filter buttons

    AdminDashboard ..> Signup : holds
    AdminDashboard ..> adminActions : addSignup / sendBroadcast
    AdminDashboard ..> supabaseBrowser : signOut
    AdminPage ..> supabaseServer : auth + fetch signups
    AdminLoginPage ..> supabaseBrowser : signInWithPassword
    SignupPage ..> supabaseBrowser : insert signup

    adminActions ..> supabaseServer : db + auth
    adminActions ..> Resend : send emails
    middleware ..> SupabaseClient : session guard for /admin
```

## Key relationships at a glance

| From | To | Kind | Why |
|------|----|------|-----|
| `Home` | `AppHeader`, `Sidebar`, `MapView` | composition | top-level map page composes the UI |
| `Sidebar` | `SearchBar` | composition | search input lives inside the sidebar |
| `Location.type` | `Categories.CategoryKey` | dependency | category drives marker colour/emoji & filtering |
| `Home` | `supabase` | dependency | client-side fetch of the `locations` table |
| `AdminDashboard` | `adminActions` | dependency | server actions for add subscriber / broadcast |
| `adminActions` | `Resend` | dependency | batch email to subscribers |
| `middleware` | `SupabaseClient` | dependency | refreshes session & guards `/admin/*` routes |

## Notes

- **Two Supabase access paths:** `supabase` (browser singleton, anon key, used by the public
  map and signup forms) vs. `createSupabaseServerClient`/`createSupabaseBrowserClient`
  (SSR cookie-aware clients used by the admin/auth flow). `middleware.ts` enforces auth on `/admin`.
- **No persisted `Signup` interface in `types/`** — it is declared locally inside
  `AdminDashboard.tsx`; the underlying table is `signups`.
- The data model is intentionally thin: one real domain entity (`Location`) plus the
  `signups` mailing-list records. Everything else is UI or service glue.
