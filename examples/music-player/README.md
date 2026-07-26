# Sona

A music & event-discovery app — discover artists and shows near you. It's a
**work-in-progress prototype** whose real job is to exercise
[routini](../../packages/routini), a tiny TypeScript-first React router, in a
real, polished UI.

Highlights:

- a **player that keeps playing across navigation** (it lives in the layout,
  outside the route `<Outlet>`)
- **shared-element View Transitions** (a feed row's artwork morphs into the
  artist hero), **lazy/code-split routes**, and **link preloading on hover**
- a real interactive **Leaflet map** of events (Explore), dark/light theming,
  and a responsive shell (desktop sidebar + 3-column player → mobile top bar +
  bottom tab bar)

> Built with an ~3 KB router. See the in-app **About** page for the full list of
> routini features and where each one is used.

## Run

```bash
npm install          # from the repo root
npm run dev -w examples/music-player
# build: npm run build -w examples/music-player
```

Node ≥ 20.12 (Vitest/rolldown). Locally we use 20.20.2.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · routini · zustand (audio store)
· Radix Slider · Leaflet + react-leaflet (Explore map)

## Structure

```
src/
  App.tsx                   route table (Router + routes array)
  components/AppLayout.tsx  persistent shell: top bar, events sidebar (desktop),
                            <Outlet>, player, mobile bottom tab bar, UserMenu (theme switch)
  pages/
    Feed.tsx        home — artist rows, sorted by distance ("Nkm from you")
    Artist.tsx      hero (VT morph target) + tracklist + "will be in" + "performing soon with"
    Event.tsx       single event
    Events.tsx      all events grid (mobile "Events" tab)
    Explore.tsx     Leaflet map of events; hover a pin → anchored popup card
    About.tsx       this prototype + routini feature map
    Notifications.tsx
    NotFound.tsx    catch-all "*"
  player/           zustand store + audio element + Radix slider
  lib/
    data.ts         GENERATED dataset (artists, events, songs) — do not hand-edit; see below
    theme.ts        dark/light store (data-theme on <html> + localStorage)
scripts/gen-data.mjs    regenerates src/lib/data.ts
public/
  artists/<slug>/cover.webp + avatar.webp
  albums/<slug>/01..06.mp3 + cover.jpg
  events/<slug>.webp
```

## Regenerating data

`src/lib/data.ts` is **generated**, not hand-written. To change artists, events,
the song pool, distances, or map coordinates, edit and re-run the generator:

```bash
node scripts/gen-data.mjs    # run from examples/music-player
```

It wires each artist to 1–4 random events, builds a 15-track song pool across the
6 albums (real cover art), assigns each artist 5–13 songs, and emits `data.ts`.
The RNG is seeded, so output is stable. (The image-reorg step that built the
per-artist `cover.webp`/`avatar.webp` folders has already run.)

## Credits

Display names, photos, and copy are illustrative (artist photos are
Pexels-licensed). The **music and album art are real Creative-Commons releases** —
all artists draw songs from this shared pool of six albums; please keep these
credits:

| Album folder | Artist | Album | License |
| --- | --- | --- | --- |
| `albums/seven-elements` | The Wanderer | Seven Elements | CC-BY |
| `albums/you-know-where-to-find-me` | Soft and Furious | You Know Where to Find Me | CC-BY |
| `albums/koi-discovery` | Ante-Chrysalide | Koi-discovery | CC-BY |
| `albums/nfamoudou-boudougou` | Breuss Arrizabalaga Quintet | Nfamoudou-Boudougou | CC-BY |
| `albums/le-chant-des-stompbox` | Monplaisir | Le chant des Stompbox | CC-BY |
| `albums/city-slacker` | HoliznaCC0 | City Slacker | CC0 |

Fonts: Acumin Pro (Adobe Fonts, via a Typekit `<link>` — not committed), with
Inter Variable as the open fallback. Map tiles © OpenStreetMap, © CARTO.

## Status

Prototype, in progress. Done: feed, artist, event, explore map, about,
notifications, events list, dark/light theme, responsive shell. Next: Event page
polish, an in-app credits surface, a landing page, and deploy.
