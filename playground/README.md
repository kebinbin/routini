# routini playground

An internal test harness that exercises routini's features in one minimal app.

It's a maintainer tool: workspace-linked to `packages/routini` so a change to
the library shows up here instantly via `npm run dev:package` +
`npm run dev:playground`.

## Run it

From the repo root:

```bash
npm run dev:playground
```

## What it covers

One sidebar entry per demo:

| Demo | Exercises |
| --- | --- |
| Eager route | `component:` (static import, no chunk) |
| Lazy + loading | `lazy:`, global **and** per-route `loading`, chunk caching |
| useParams | single + multiple params, URL-decoding |
| useSearchParams | reactive query read/write, `replace` option |
| navigate + Navigate | `navigate()`, `useLocation().navigate`, `<Navigate>` redirect, `<Link replace>`, `target` fallback |
| View Transitions | forward `viewTransition`, shared-element morph, automatic back/forward replay |
| Link preload | `hover` / `render` / `viewport`, each with a live "loaded" indicator |
| Error boundary | render throw **and** failed-chunk import → function `errorFallback` with `reset` / `reload` / `isChunkError`, plus `onError` logging |
| Hash anchors | pure `#hash` and `path#hash` |
| Scroll restoration | `scrollRestoration` (window-scoped) — forward nav to top, back/forward restores offset |
| JSX `<Route>` | the JSX-children input form alongside the `routes` array |
| Catch-all 404 | `*` renders in place (no redirect) |
| Sidebar | `useLocation()`-driven active links |
