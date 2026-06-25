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
    events **Sidebar** is desktop-only (`hidden lg:flex`); `<main>` holds the `<Outlet>`.
  - Footer: the **Player** + the mobile **BottomNav** (tab bar, `lg:hidden`).
  - **UserMenu** (avatar) is a dropdown with the **theme switch**; `variant`
    = `topbar` (opens down) or `bottom` (opens up, in the tab bar).
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

## Branch / PR

- Work lives on `feat/music-player` → PR #19 (to `main`). routini library stays
  zero-dependency; the demo's deps (zustand, radix, leaflet, fontsource) are the
  example's only.
