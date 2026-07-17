# Working notes — Sona (music-player demo)

Internal notes for picking this up in a future session. Sona is a **prototype**
to exercise routini's features in a realistic app. README.md is the public
overview; this file is the "how it actually works + what's left" doc.

## Architecture

- **Shell** — `components/AppLayout.tsx` is the persistent frame:
  - Grid `grid-rows-[auto_1fr_auto]`: top bar / middle / footer.
  - Top bar has `relative z-30` so the UserMenu dropdown sits above the
    scrolling `<main>` (its `view-transition-name` makes it a stacking context).
  - Middle: `flex flex-col` (mobile) → `lg:grid lg:grid-cols-[340px_1fr]`. The
    **"For you" Sidebar** (`components/ActivityFeed.tsx`) is desktop-only
    (`hidden lg:flex`); `<main>` holds the `<Outlet>`. `useLocation()` drops the
    sidebar (full-width) on `/about` and `/activity` only — the discovery lenses
    (`/artists`, `/events`, `/map`) keep it.
  - **Scroll-to-top on navigation**: a `useLayoutEffect` on the pathname resets
    `<main>`'s scroll to top each navigation (skipped when there's a hash, so
    anchor links still work). routini deliberately doesn't manage scroll, and the
    scroll container is `<main>`, not the window — so this is the app's job.
  - Footer: the **Player** + the mobile **BottomNav** (tab bar, `lg:hidden`).
  - **UserMenu** (avatar) is a dropdown with the **theme switch**; `variant`
    = `topbar` (opens down) or `bottom` (opens up, in the tab bar).
- **Discovery lenses** — `components/DiscoveryNav.tsx`: a segmented control
  (`DiscoveryTabs`) switching **Artists** (`/artists`) · **Events** (`/events`) ·
  **Map** (`/map`) — three routed views over the same near-you dataset, rendered
  in the page content (not the top nav). `DiscoveryHeader` is the shared sticky
  header (lens tabs + a page title; the Artists page also gets the layout
  switcher in its `right` slot).
- **Follow / activity** — the heart (`Feed` + `Artist`) toggles a persisted
  follow store (`lib/follow.ts`, zustand + localStorage). `lib/activity.ts`
  derives a new-show + new-release per followed artist; `ActivityFeed` renders
  them (artist circle + text, **plain links — no VT**, since a circle avatar
  can't cleanly morph into the horizontal hero). Shown in the desktop sidebar
  and the `/activity` page (mobile bell/tab). *Replaced the old notifications
  master-detail, which was a workaround for routini's lack of nested routes.*
- **Routes** — `App.tsx`, a `routes` array. `/` → `<Navigate to="/artists">`
  (a tiny `RootRedirect` component — this is where routini's `<Navigate>` is
  dogfooded). `/artists` is eager (`Feed`); `/events`, `/map`, `/activity`,
  `/about`, `/artist/:id`, `/event/:id` are all `lazy`. `*` → NotFound.
  (`/explore` was renamed to `/map`.)
- **Player** — `player/`: a zustand store (`currentSong`, `queue`, `isPlaying`,
  `volume`, `play`, …) + one `<audio>` + Radix slider. Two layouts in
  `Player.tsx`: mobile (`lg:hidden`, art-left / transport-right / full-width
  seek) and desktop (`hidden lg:flex`, 3-column). Always-rendered art slot so it
  keeps height with no track.
- **Theme** — `lib/theme.ts` (`useTheme`/`setTheme`) toggles `data-theme` on
  `<html>` + localStorage. Light palette overrides the CSS vars under
  `html[data-theme="light"]` in `index.css`. No-flash inline script in
  `index.html` sets it before paint (saved choice, else system preference).

## Data (generated — `lib/data.ts`)

- **Do not hand-edit `data.ts`.** Regenerate with `node scripts/gen-data.mjs`
  (run from `examples/music-player`). Seeded RNG → stable output.
- 18 artists, 14 events, 12 venues. Each artist plays 1–4 random events (so `eventsForArtist`
  + `coPerformers` derive "will be in" / "performing soon with"). Six artists are
  force-ordered first (`FIRST` in the generator). Each artist has `distanceKm`
  ascending in that display order → the feed sorts nearest-first.
- **Songs**: a shared 15-track POOL across the 6 albums (real `cover.jpg`),
  durations read via ffprobe; each artist gets 5–13 of them. (The albums are
  named after the OLD artist slugs but are just CC audio folders — see README
  credits. We'll likely give artists their own albums later.)
- **Venues are a first-class entity** (`Venue` = `{ id, name, lat, lng, photo?,
  description? }`; exported `venues` array + `getVenue`). Defined as `VENUES` in
  `gen-data.mjs`. An event references one by `venueId` (slug of the venue name);
  the build **denormalizes** the venue's `name`/`lat`/`lng`/`photo`/`description`
  onto the event (`event.venue`, `event.lat`, `event.lng`, `event.venuePhoto`,
  `event.venueDescription`) for convenience.
- **A venue can host several events** — currently the **Coliseo** (Mundo Tour +
  Ritmo Caribe) and **La Respuesta** (Sesión Nocturna + Fiesta Neón). "Other
  events at this venue" filters by `venueId`.
- **Events** also carry `date`, `time`, `poster`, `description`, `lineup`
  (artist ids). The event order in `gen-data` is unchanged, so the seeded lineup
  RNG produces identical lineups.
- **Venue photos** live in `public/venues/<slug>.webp` (Pexels, CC/free). To add
  one: drop the image, set `photo` in the matching `VENUES` entry, regenerate.
  See `public/venues/README.md`.
- Helpers exported: `getArtist`, `getEvent`, `getVenue`, `eventsForArtist`,
  `coPerformers`.

## Streaming links & audio previews (technical)

How the "taste in-app, hear more outside" mechanic is wired, and the technical
options for it.

- **Deep-links out (`StreamingLinks` in `Artist.tsx`).** Currently builds
  **search** URLs (`open.spotify.com/search/<name>`, `soundcloud.com/search`,
  `youtube.com/results`). To land on the artist's *actual* profile instead of a
  search page, store real handles on the artist record
  (`spotifyId` / `soundcloudUrl` / `youtubeUrl`) and link directly
  (`open.spotify.com/artist/<id>`, etc.). Pure data change — add the fields in
  `gen-data.mjs`, render them in `StreamingLinks`. Search is the safe fallback
  when a handle is unknown.
- **In-app preview audio (what ships today).** Self-hosted clips in the repo
  (CC-licensed, compressed). This is the simplest legal model — no third-party
  API, no token, no rate limit — and it's what a real opt-in/artist-uploaded
  flow would look like.
- **Third-party preview sources (feasibility, if ever needed):**
  - **Spotify Web API** — track objects expose a 30s `preview_url` (MP3). Needs
    an app token to fetch metadata; the clip itself is a plain URL. Caveat:
    coverage is partial and access to `preview_url` has been **restricted for
    newer apps** — verify current availability before depending on it.
  - **Apple Music API** — also serves 30s previews; requires a developer token
    (JWT).
  - **SoundCloud API** — effectively **closed to new app registrations**; don't
    build on it.
  - **YouTube IFrame API** — legal to embed, but it's video (not a clean audio
    preview) and registers as a YouTube play.
  - **Self-hosted / artist-uploaded** — what the demo does; zero licensing
    friction.
- **Outbound event link (built).** The event page (`Event.tsx`) has a **"Get
  tickets"** button — currently a render-time Google search for
  `"<title> <venue> tickets"` (no `ticketUrl` in the data yet; a stored field
  would replace it).

## Map (`pages/Map.tsx` + `components/EventMap.tsx`)

The Leaflet bits are shared in `components/EventMap.tsx` (`pinIcon`, `tileUrl`,
`MAP_ATTRIBUTION`, and the popup/mini-map components). `pages/Map.tsx` is the
`/map` lens; `EventMiniMap` is the embedded map on the event page.

- Real **Leaflet** via `react-leaflet@5`. CARTO `dark_all` / `light_all` tiles
  (keyless), swapped by theme. `bounds` fit to the pins.
- **One pin per venue** — the `/map` lens iterates `venues` (not events), so
  co-located events don't stack. Pins are a CSS `divIcon` (`.sona-pin`); hover/
  click opens its **Leaflet `<Popup>`**.
- The `/map` popup is `VenueEventsPopup`: an `EventCard` (poster left — shares
  `poster-<id>` with the event hero so it morphs — details + lineup + "View
  event" right). When a venue hosts **multiple** events, a `‹ 1/2 ›` control
  cycles them in place (local `useState`).
- The **event page** embeds `EventMiniMap` (tall, single pin, popup auto-opened
  via a `useMap`-gated effect) in a "How to get to <venue>" section, reached
  from the hero's "View on map" — a JS `scrollIntoView`, since native fragment
  scroll is unreliable inside the nested `<main>` scroller. Its popup is
  `VenuePopup` (vertical): venue photo on top + blurb + this event's date/time +
  other events at the venue + "Get directions" (Google Maps dir URL). No lineup
  (it's already on the page).
- **Map view in the URL**: `useSearchParams` writes `?lat&lng&z` on `moveend`
  (`replace`). The pathname-only store means this never remounts the map; `/map`
  seeds the URL on mount.
- Popups themed via `.sona-popup …` in `index.css` (beats Leaflet's stylesheet);
  the filled link uses `.sona-cta`. `isolate` on the wrapper contains Leaflet's
  high z-indexes.

## View Transitions

- Browser-default approach (no `animation:none` overrides). The Feed row's photo
  + name + date share per-id `view-transition-name`s with the Artist hero, so
  they morph. The **event poster** shares `poster-<id>` between the Events grid,
  the map popups, and the artist page's "will be in" posters → the Event hero
  flyer, so those morph too. Chrome bits (`sona-topbar/sidebar/player`) are named
  to stay put.

## Gotchas

- **Node ≥ 20.12** for Vitest/rolldown; run tooling with
  `PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npm …`.
- CI uses `npm ci` **+ `npm install`** to dodge the rolldown native-binding
  optional-deps bug on a cold cache (npm/cli#4828).
- **Audio is heavy** even compressed (~55 MB): tracks are 128 kbps, 2 full + 4
  45-second previews per album. Don't re-add full-length high-bitrate audio.
- Buttons need `cursor-pointer` (Tailwind v4 reset doesn't add it) — handled
  globally in `index.css`.
- Acumin Pro is NOT committed (Adobe license) — paste the Typekit `<link>` into
  `index.html` to activate; falls back to Inter.

## TODO / next

- [x] Event page (`Event.tsx`) layout pass — blurred-flyer hero (two columns),
      longer descriptions, start times, lineup with the layout switcher, and the
      "How to get to <venue>" embedded map.
- [ ] Fill `photo` + `description` for any venues still missing them in `VENUES`
      (most have a Pexels image now).
- [ ] Store a real `ticketUrl` per event (Get-tickets is a search link for now).
- [ ] In-app credits surface (CC-BY attribution) — README has the table; About
      links the repo. A dedicated credits page/section would be cleaner.
- [ ] Sona landing page (from the Figma landing frame).
- [ ] Deploy (Vercel/Netlify subdir) + link from the routini site "Built with".
- [ ] Maybe give artists their own albums instead of the shared pool.

## Honest assessment — is Sona a good routini case study?

Short version: **strong portfolio piece, good-but-incomplete routini showcase.**

**What Sona genuinely proves about routini:**

- Lazy routes + `preload="hover"` → navigation feels instant (every `Link`).
- Shared-element **View Transitions** (feed row → artist hero morph) — the
  standout; no animation library.
- `useParams` drives the artist/event pages; `useLocation` drives the full-width
  layout switch + the active discovery lens; `<Navigate>` does the `/` →
  `/artists` redirect.
- **`useSearchParams` on the Map** is the best routini demo in the repo: the map
  view lives in the URL, and because the location store is pathname-only, writing
  `?lat&lng&z` never remounts the (expensive) Leaflet map. A real, hard-to-fake
  advantage.

**What Sona quietly exposes (be honest about it):**

- The persistent player/nav-outside-`<Outlet>` trick works because Sona has
  **exactly one layout**. Elegant here; it would not scale to multiple nested
  layouts.
- The single-layout-outside-`<Outlet>` pattern (above) is where the flat router
  shows its ceiling — it works because there's exactly one layout. (The old
  notifications master-detail, a nested-routes workaround, is gone — replaced by
  the Follow + activity feed.)
- Still-unused exports/features: `navigate()`, `preload="render"`,
  `preload="viewport"`, and the error boundary (`errorFallback`/`onError`). So
  it's not yet a *complete* showcase. (`<Navigate>` is now used for the root
  redirect.)

**Verdict:** Sona honestly shows routini is more than sufficient for a
single-layout SPA, and that its View-Transition and URL-state stories are
excellent. It should **not** be sold as a drop-in replacement for a full-featured
router — the single-layout ceiling is the clearest in-app evidence that nested
routes are routini's most-missed feature.

## Improvement roadmap (toward the product's purpose)

Purpose: *discover artists/events near you by **experiencing the music first**
(not flyers), see where they play next + who shares the stage, make local music
accessible, and give independent artists a space to promote.* Measured against
that, the current build is visual-first and several pillars are missing.

**P0 — make "music first" literally true**

- Audio-first feed: previews **autoplay on hover/scroll** so you discover by
  listening, not by reading a flyer. This is the thesis; today music is secondary
  to the visuals.
- A "discovery radio" / continuous-play mode that walks nearby artists.

**P0 — tie the app together with Follow + meaningful activity — DONE**

- ✅ **Follow artists** — the heart (feed + artist page) toggles a persisted
  follow store (`lib/follow.ts`). A single concept: like = follow.
- ✅ The old notifications master-detail is **gone**, replaced by a **"For you"
  activity feed** (`ActivityFeed` + `lib/activity.ts`): new shows/releases from
  followed artists, artist-circle + text, plain links (no VT). Lives in the
  desktop sidebar and the `/activity` page (mobile bell/tab). This both removed
  the nested-routes friction and gave the bell a reason to exist.
- Next: a "discovery radio" off your follows; richer activity (when a *new*
  show/release actually appears vs. the static derive); inline preview-play in
  the activity rows.

**P1 — make "near you" real**

- Geolocation (with permission) or a location picker → real distances; let the
  **Map filter the feed** (and vice-versa). "Explore near you" in the top nav is
  a placeholder for this (links to `/map` for now; see the comment in AppLayout).
- Wire the decorative **Search** and **Filters** (genre / date / distance).

**P1 — serve independent artists (currently 0% of the app)**

- A "For artists" surface: submit a show / claim a profile / upload music +
  events (even mocked). A whole stated purpose has no UI yet.
- Event **RSVP / "I'm going"** to bridge streaming → live (a basic "Get tickets"
  outbound search link exists; RSVP state doesn't).

**P2 — polish + routini completeness**

- ✅ Event page layout pass (hero + lineup + venue map). Remaining: in-app
  credits surface; Sona landing page.
- Round out the routini showcase: ✅ `<Navigate>` (root redirect); still
  `navigate()` for search-submit, `preload="viewport"` for feed/grid rows
  scrolling into view, and a branded `errorFallback`.

## Branch / PR

- Work lives on `feat/music-player` → PR #19 (to `main`). routini library stays
  zero-dependency; the demo's deps (zustand, radix, leaflet, fontsource) are the
  example's only.
