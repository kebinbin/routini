# Sona

A music-first event finder — discover artists performing near you. Built as a
demo to show off [routini](../../packages/routini) in a real, polished UI:

- a **player that keeps playing across navigation** (it lives in the layout,
  outside the route outlet)
- **lazy, code-split routes** with **View Transitions** and **link preloading**
- typed route params, all from an ~3 KB router

## Run

```bash
npm install          # from the repo root
npm run dev -w examples/music-player
```

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · routini · zustand · Radix Slider

## Structure

- `src/components/AppLayout.tsx` — the persistent shell (top bar · sidebar · outlet · player)
- `src/pages/` — Feed, Artist, Event, NotFound
- `src/player/` — the player (store, slider, audio)
- `src/lib/data.ts` — mock data (no backend; routing only)

## Credits

The design names, photos and copy are illustrative. The **music and album art are
real Creative-Commons releases** — please keep these credits:

| In the app | Music | Album |
| --- | --- | --- |
| Tony Croatto | The Wanderer | Seven Elements |
| iLe | Soft and Furious | You Know Where to Find Me |
| Residente | Ane-Chrysalide | Koi-discovery |
| Plenero de la Cresta | Breuss Arrizabalaga Quintet | Nfamoudou-Boudougou |
| Buena Vista | Monplaisir | Le chant des Stompbox |
| Control Machete | Holizna | City Slacker (CC0) |

Artist photos are Pexels-licensed. Fonts: Acumin Pro (Adobe Fonts), with Inter as
the open fallback.
