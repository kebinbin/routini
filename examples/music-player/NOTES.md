# Working notes — Sona (music-player demo)

Internal notes for picking this up in a future session. Sona is a **prototype**
to exercise routini's features in a realistic app. README.md is the public
overview; this file is the "how it actually works + what's left" doc.

## Architecture

- **Shell** — `components/AppLayout.tsx` is the persistent frame:
  - Grid `grid-rows-[auto_1fr_auto]`: top bar / middle / footer.
  - Top bar has `relative z-30` so the UserMenu dropdown sits above the
    scrolling `<main>` (its `view-transition-name` makes it a stacking context).
  - Middle: `flex flex-col` (mobile) → `lg:grid lg:grid-cols-[300px_1fr]`. The
    **"For you" Sidebar** (`components/ActivityFeed.tsx`) is desktop-only
    (`hidden lg:flex`); `<main>` holds the `<Outlet>`. `useLocation()` drops the
    sidebar (full-width) on `/about` and `/activity`.
  - Footer: the **Player** + the mobile **BottomNav** (tab bar, `lg:hidden`).
  - **UserMenu** (avatar) is a dropdown with the **theme switch**; `variant`
    = `topbar` (opens down) or `bottom` (opens up, in the tab bar).
- **Follow / activity** — the heart (`Feed` + `Artist`) toggles a persisted
  follow store (`lib/follow.ts`, zustand + localStorage). `lib/activity.ts`
  derives a new-show + new-release per followed artist; `ActivityFeed` renders
  them (artist circle + text, **plain links — no VT**, since a circle avatar
  can't cleanly morph into the horizontal hero). Shown in the desktop sidebar
  and the `/activity` page (mobile bell/tab). *Replaced the old notifications
  master-detail, which was a workaround for routini's lack of nested routes.*
- **Routes** — `App.tsx`, a `routes` array. Home (`/`) is eager (`Feed`); every
  other page is `lazy`. `*` → NotFound.
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
- 18 artists, 14 events. Each artist plays 1–4 random events (so `eventsForArtist`
  + `coPerformers` derive "will be in" / "performing soon with"). Six artists are
  force-ordered first (`FIRST` in the generator). Each artist has `distanceKm`
  ascending in that display order → the feed sorts nearest-first.
- **Songs**: a shared 15-track POOL across the 6 albums (real `cover.jpg`),
  durations read via ffprobe; each artist gets 5–13 of them. (The albums are
  named after the OLD artist slugs but are just CC audio folders — see README
  credits. We'll likely give artists their own albums later.)
- **Events** carry `lat`/`lng` (real San Juan coords) for the Explore map and a
  `lineup` (artist ids).
- Helpers exported: `getArtist`, `getEvent`, `eventsForArtist`, `coPerformers`.

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
- **Outbound event link (TODO).** The event page (`Event.tsx`) should carry an
  external **"Get tickets / RSVP"** link (`ticketUrl` on the event record) — the
  one outbound action the rest of the flow leads toward. See the RSVP/tickets
  item under TODO.

## Explore map (`pages/Explore.tsx`)

- Real **Leaflet** map via `react-leaflet@5`. Tiles = CARTO `dark_all` /
  `light_all` (keyless), swapped by theme. `bounds` fit to the pins (zoom-to-events).
- Pins are a CSS `divIcon` (`.sona-pin`). Hover a pin → opens its **Leaflet
  `<Popup>`** (non-blocking; you can move to other pins). The popup renders the
  horizontal event card (poster `object-cover` left, details + lineup avatars +
  "View event" right).
- Popup is themed via `.sona-popup …` overrides in `index.css` (scoped under the
  popup class so they beat Leaflet's stylesheet, which loads in the lazy chunk).
  Leaflet's blue link color is reset; the CTA uses `.sona-cta`.
- `isolate` on the map wrapper contains Leaflet's high z-indexes (else they leak
  above the top bar).

## View Transitions

- Browser-default approach (no `animation:none` overrides). The Feed row's photo
  + name + date share per-id `view-transition-name`s with the Artist hero, so
  they morph. Chrome bits (`sona-topbar/sidebar/player`) are named to stay put.

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

- [ ] Event page (`Event.tsx`) layout pass (poster + details + lineup + map?).
- [ ] In-app credits surface (CC-BY attribution) — README has the table; About
      links the repo. A dedicated credits page/section would be cleaner.
- [ ] Sona landing page (from the Figma landing frame).
- [ ] Deploy (Vercel/Netlify subdir) + link from the routini site "Built with".
- [ ] Maybe give artists their own albums instead of the shared pool.
- [ ] More event flyers if we want >14 pins on the map.

## Honest assessment — is Sona a good routini case study?

Short version: **strong portfolio piece, good-but-incomplete routini showcase.**

**What Sona genuinely proves about routini:**

- Lazy routes + `preload="hover"` → navigation feels instant (every `Link`).
- Shared-element **View Transitions** (feed row → artist hero morph) — the
  standout; no animation library.
- `useParams` drives the artist/event/notification pages; `useLocation` drives
  the full-width layout switch.
- **`useSearchParams` on the Explore map** is the best routini demo in the repo:
  the map view lives in the URL, and because the location store is pathname-only,
  writing `?lat&lng&z` never remounts the (expensive) Leaflet map. A real,
  hard-to-fake advantage.

**What Sona quietly exposes (be honest about it):**

- The persistent player/nav-outside-`<Outlet>` trick works because Sona has
  **exactly one layout**. Elegant here; it would not scale to multiple nested
  layouts.
- The **notifications master-detail is a workaround** for routini having no
  nested routes — `/notifications` + `/notifications/:id` share one lazy import
  so the list doesn't remount. Clever, but it's the router fighting the design,
  and it's why that page has been the hardest to get right.
- Unused exports/features: `<Navigate>`, `navigate()`, `preload="render"`,
  `preload="viewport"`, and the error boundary (`errorFallback`/`onError`). So
  it's not yet a *complete* showcase.

**Verdict:** Sona honestly shows routini is more than sufficient for a
single-layout SPA, and that its View-Transition and URL-state stories are
excellent. It should **not** be sold as a drop-in replacement for a full-featured
router — and the notifications friction is the clearest in-app evidence that
nested routes are routini's most-missed feature.

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
  **Explore map filter the feed** (and vice-versa).
- Wire the decorative **Search** and **Filters** (genre / date / distance).

**P1 — serve independent artists (currently 0% of the app)**

- A "For artists" surface: submit a show / claim a profile / upload music +
  events (even mocked). A whole stated purpose has no UI yet.
- Event **RSVP / "I'm going" / tickets** to bridge streaming → live.

**P2 — polish + routini completeness**

- Event page layout pass; in-app credits surface; Sona landing page.
- Round out the routini showcase: `<Navigate>` for an onboarding/guard redirect,
  `navigate()` for search-submit, `preload="viewport"` for feed/grid rows
  scrolling into view, and a branded `errorFallback`.

## Branch / PR

- Work lives on `feat/music-player` → PR #19 (to `main`). routini library stays
  zero-dependency; the demo's deps (zustand, radix, leaflet, fontsource) are the
  example's only.
