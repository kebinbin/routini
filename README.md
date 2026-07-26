<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kebinbin/routini/main/assets/logo-dark.svg">
    <img src="https://raw.githubusercontent.com/kebinbin/routini/main/assets/logo-light.svg" alt="routini" height="40">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/routini"><img src="https://img.shields.io/npm/v/routini.svg" alt="npm version"></a>
  <a href="https://github.com/kebinbin/routini/actions/workflows/ci.yml"><img src="https://github.com/kebinbin/routini/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/bundle-2.8%20KB%20gzip-success" alt="bundle size">
  <a href="https://github.com/kebinbin/routini/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

A tiny router for React with lazy, code-split routes, View Transitions, and error recovery built in.

> Small to ship, scoped to one job, free of setup ceremony.

~2.8 KB gzipped · **zero runtime dependencies** · 9 exports. Lazy routes, an
error boundary, View Transitions, reactive search params, and link preloading
all ship in the box.

## Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
- [Route Definition](#route-definition)
- [Lazy Loading](#lazy-loading)
- [Error handling](#error-handling)
- [Catch-all Route](#catch-all-route)
- [View Transitions](#view-transitions)
- [Preloading](#preloading)
- [Scroll restoration](#scroll-restoration)
- [Reading the version](#reading-the-version)
- [Philosophy](#philosophy)
- [What's not in scope](#whats-not-in-scope)
- [Performance](#performance)
- [Roadmap](#roadmap)
- [Development](#development)

## Installation

```bash
npm install routini
```

## Quick Start

```tsx
import { Router, Route, Link, Outlet } from "routini";
import Nav from "./components/Nav";

const routes = [
  { path: "/", lazy: () => import("./pages/Home") },
  { path: "/about", lazy: () => import("./pages/About") },
  { path: "/product/:productId", lazy: () => import("./pages/Product") },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

function App() {
  return (
    <Router routes={routes}>
      <Nav />
      <main>
        <Outlet />
      </main>
    </Router>
  );
}
```

## API

### `<Router />`

The root component. Provides routing context to all children.

```tsx
<Router
  routes={routes} // route definitions array
  loading={<Spinner />} // global loading fallback for lazy routes
  errorFallback={<Oops />} // shown when a route fails to load or throws
  scrollRestoration // top on forward nav, restore on back/forward (opt-in)
>
  {children}
</Router>
```

### `<Route />`

Define routes as JSX children of `<Router />`.

```tsx
<Router>
  <Route path="/" component={Home} />
  <Route path="/about" lazy={() => import("./pages/About")} />
</Router>
```

### `<Link />`

Client-side navigation. Handles modifier keys (cmd, ctrl, shift, alt) correctly.

```tsx
<Link to="/about">About</Link>
```

Optional props beyond the standard `<a>` attributes:

```tsx
<Link to="/dashboard" replace>Dashboard</Link>          {/* replace the history entry */}
<Link to="/album/9" viewTransition>Open album</Link>    {/* animate the navigation */}
<Link to="/album/9" preload="hover">Open album</Link>   {/* warm the chunk on hover */}
```

- `replace` — swap the current history entry instead of pushing a new one.
- `viewTransition` — animate the navigation with the View Transitions API
  (see [View Transitions](#view-transitions)); browsers without support
  navigate instantly.
- `preload` — load the route's code-split chunk ahead of the click
  (see [Preloading](#preloading)); `"hover"`, `"render"`, or `"viewport"`.

Hash anchors are handled too:

- `to="#section"` — pure hash, the browser scrolls natively.
- `to="/docs#section"` — navigates to the path, then scrolls to the element
  with that `id` once the route has rendered (works with lazy routes).

```tsx
<Link to="/docs#api">API reference</Link>
```

### `<Outlet />`

Renders the matched route. Use when you need layout control:

```tsx
<Router routes={routes}>
  <Nav />
  <Outlet />
  <Footer />
</Router>
```

If no `<Outlet />` is used, the matched route renders automatically.

### `<Navigate />`

Declarative redirect.

```tsx
function Dashboard() {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <h1>Dashboard</h1>;
}
```

Redirects **replace** the current history entry by default — otherwise the
back button would return to the route that redirected away, which immediately
redirects forward again (a back-button trap). Pass `replace={false}` to push
a new entry instead.

### `useParams()`

Access route parameters.

```tsx
// Route: /product/:productId
function Product() {
  const { productId } = useParams<{ productId: string }>();
  return <h1>Product {productId}</h1>;
}
```

### `useLocation()`

Access current path and navigate programmatically.

```tsx
function Nav() {
  const { path, navigate } = useLocation();
  return (
    <nav>
      <Link to="/" style={path === "/" ? { fontWeight: "bold" } : {}}>
        Home
      </Link>
      <button onClick={() => navigate("/about")}>About</button>
    </nav>
  );
}
```

### `useSearchParams()`

Read and update the URL's query string reactively — search state that's
shareable, bookmarkable, and survives refresh and Back/Forward.

```tsx
function ProductSearch() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <input
      value={q}
      onChange={(e) => setParams({ q: e.target.value })} // updates ?q= in the URL
    />
  );
}
```

Returns the current `URLSearchParams` and a setter. The setter navigates to the
current pathname with the new query and accepts the usual navigate options:

```tsx
setParams({ q: "routers", sort: "stars" });      // push a new entry
setParams({ q: "routers" }, { replace: true });   // swap the current entry
```

Routini's location store tracks the **pathname only**, so a normal route render
never re-runs on a query-only change — this hook keeps its own subscription, so
components that read the query stay in sync while the rest of the tree doesn't
re-render on a query change.

### `navigate()`

Imperative navigation for event handlers or code outside components — the same
function that powers `Link` and `Navigate`.

```tsx
import { navigate } from "routini";

navigate("/checkout");
navigate("/dashboard", { replace: true }); // swap the history entry
navigate("/album/9", { viewTransition: true }); // animate the navigation
```

## Route Definition

Routes can be defined as an array or as JSX children:

```tsx
// Array — recommended, supports lazy loading
const routes = [
  { path: "/", lazy: () => import("./pages/Home") },
  { path: "/about", lazy: () => import("./pages/About") },
  { path: "/product/:productId", lazy: () => import("./pages/Product") },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

// JSX children — for simple cases
<Router>
  <Route path="/" component={Home} />
  <Route path="/about" component={About} />
</Router>;
```

### Path matching

Patterns are matched by a small built-in matcher — no regex dependency. Three forms:

- **Static** — `/about` matches `/about` exactly.
- **`:param`** — `/product/:productId` captures that segment (URL-decoded) into
  `useParams()`. Multiple params work: `/users/:userId/posts/:postId`.
- **`*`** — catch-all, always tried last regardless of position.

Matching is **case-sensitive** — `/About` does **not** match a `/about` route
(the correct web default). One optional trailing slash is tolerated
(`/about/` matches `/about`). Query strings and hashes never affect matching.

## Lazy Loading

Routini encourages lazy loading by default. Use `lazy` for all page-level routes:

```tsx
const routes = [{ path: "/", lazy: () => import("./pages/Home") }];
```

Each lazy route is code-split automatically — users only download the code
for routes they actually visit.

### Loading fallbacks

Global fallback for all lazy routes:

```tsx
<Router routes={routes} loading={<Spinner />} />
```

Per-route fallback:

```tsx
{ path: "/dashboard", lazy: () => import("./pages/Dashboard"), loading: <DashboardSkeleton /> }
```

Per-route fallback takes priority over the global fallback.

### Stable references

Define routes outside your component to ensure stable references
and avoid unnecessary remounts:

```tsx
// ✅ Correct — stable reference, cache works
const routes = [{ path: "/about", lazy: () => import("./pages/About") }];

function App() {
  return <Router routes={routes} />;
}

// ❌ Avoid — new reference every render
function App() {
  const routes = [{ path: "/about", lazy: () => import("./pages/About") }];
  return <Router routes={routes} />;
}
```

In development, routini warns once if the `routes` array changes identity
between renders **and** contains lazy routes — the exact case that causes the
remounts above. (Eager routes are unaffected, so they don't trigger it.)

## Error handling

Lazy routes can fail to load — most often a **stale chunk after a deploy** (an
open tab references an old hashed file that no longer exists), or a network
blip. Suspense doesn't catch this (it only catches *suspension*), so a failed
chunk would otherwise unmount your whole app. routini wraps every route in an
error boundary, so one broken route shows a fallback instead of a white
screen — covering both failed lazy imports and render errors in the page. The
boundary clears itself automatically when you navigate to another route.

By default it renders a minimal message. Pass `errorFallback` to replace it:

```tsx
<Router
  routes={routes}
  errorFallback={
    <div className="error">
      <h2>This page didn’t load</h2>
      <button onClick={() => location.reload()}>Reload</button>
    </div>
  }
/>
```

For full control, pass a function — it receives the error and recovery helpers:

```tsx
<Router
  routes={routes}
  errorFallback={({ error, reset, reload, isChunkError }) =>
    isChunkError ? (
      // A stale chunk after a deploy — a fresh document fixes the chunk URLs.
      <button onClick={reload}>New version available — reload</button>
    ) : (
      // A render error — retry in place, without losing app state.
      <div>
        <p>{error.message}</p>
        <button onClick={reset}>Try again</button>
      </div>
    )
  }
/>
```

- `error` — the thrown error.
- `reset()` — retry the route in place (re-runs a failed lazy import, keeps app state).
- `reload()` — hard-reload the page. routini never calls this itself; it's yours to offer.
- `isChunkError` — `true` for a failed code-split download, `false` for a render bug.

Use `onError` for logging:

```tsx
<Router routes={routes} onError={(error, info) => Sentry.captureException(error)} />
```

The boundary wraps the matched **page**, so in a layout any components you
render around `<Outlet />` stay on screen when a page errors — only the page
area shows the fallback. It does **not** cover those layout components
themselves: if anything in your layout can throw, wrap `<Router>` in your own
error boundary too.

## Catch-all Route

Use `path="*"` to handle unmatched paths:

```tsx
const routes = [
  { path: "/", lazy: () => import("./pages/Home") },
  { path: "*", lazy: () => import("./pages/NotFound") }, // 404 page
];
```

The `*` route matches regardless of its position in the array —
routini always tries specific routes first.

## View Transitions

Opt any navigation into the
[View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
— the browser snapshots the old and new page and animates between them:

```tsx
<Link to="/album/9" viewTransition>Open album</Link>

navigate("/album/9", { viewTransition: true });
```

The animation itself is designed in CSS. The default is a quick cross-fade;
customize it with the `::view-transition-*` pseudo-elements, or give an element
a `view-transition-name` to morph it between pages (e.g. an album cover that
grows into the detail header):

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}
```

```tsx
<img src={album.cover} style={{ viewTransitionName: "cover" }} />
```

Notes:

- **Progressive enhancement** — browsers without `document.startViewTransition`
  navigate instantly. No feature checks needed in your code.
- Transitions are opt-in per navigation: the page is non-interactive while an
  animation runs, so reserve it for navigations where motion adds meaning.
- **Back and forward animate too.** When a navigation opts into a transition,
  routini tags the history entry — so pressing Back or Forward across that edge
  replays the same animation automatically, with no extra code. Edges that were
  never animated stay instant.
- **Pair lazy routes with preloading.** On a lazy route whose chunk isn't
  loaded yet, the transition animates to the loading fallback rather than the
  page. Add [`preload`](#preloading) to the link so the chunk is warm before
  the click and the transition lands on the real page.

## Preloading

Load a lazy route's code-split chunk *before* the user navigates, so the page is
ready on click — no loading fallback, and View Transitions land on the real page
instead of a spinner.

```tsx
<Link to="/album/9" preload="hover">Open album</Link>    {/* on intent */}
<Link to="/album/9" preload="render">Open album</Link>   {/* when the link mounts */}
<Link to="/album/9" preload="viewport">Open album</Link> {/* when it scrolls into view */}
```

- `preload="hover"` — warms the chunk when the user hovers the link or focuses
  it with the keyboard (they've signalled intent). Best for most links.
- `preload="render"` — warms the chunk as soon as the link mounts, scheduled in
  an idle callback so it never competes with the current page's own loading.
  Best for the one route you expect almost everyone to visit next.
- `preload="viewport"` — warms the chunk when the link scrolls into view. All
  viewport links share a single `IntersectionObserver`, so a long list stays
  cheap; a no-op where `IntersectionObserver` is unavailable. Best for links far
  down a long page.

Only **lazy** routes have a chunk to fetch — `preload` is a no-op for eager
routes. Each chunk is fetched at most once, however many times it's hovered or
however many links point at it. A failed preload is swallowed silently; the real
navigation still surfaces the error through the
[error boundary](#error-handling).

## Scroll restoration

Opt in with `<Router scrollRestoration>`: forward navigations scroll to the top,
and back/forward restores the position you'd scrolled to — the behavior most
SPAs want. It's off by default (nothing scrolls on navigation unless you ask).

```tsx
<Router routes={routes} scrollRestoration />
```

The router is the right place for this because only it knows the navigation
*type* (a link click vs. the back button), which is exactly what's needed to
decide "scroll to top" vs. "restore." It keys positions on the pathname, so
query-only navigations (search params) don't reset scroll.

By default it restores the **window** scroll. If your layout scrolls a nested
element instead (e.g. a `<main>` inside a fixed shell), point it there:

```tsx
const scrollRef = useRef<HTMLElement>(null);

<Router routes={routes} scrollRestoration scrollContainer={scrollRef} />;
<main ref={scrollRef}>{/* the actual scroll container */}</main>;
```

Restores best when the target route's content is present on navigation. For an
uncached lazy route that suspends on back, the restore lands once the chunk is
warm — pair with [`preload`](#preloading) to keep it instant.

## Reading the version

`package.json` is exported, so you can read the installed version:

```ts
import { version } from "routini/package.json";
```

## Philosophy

**Pages are self-contained.** Routes get their data from:

- `useParams()` — route parameters
- `useLocation()` — current path
- `useSearchParams()` — query string (`?q=…`)
- React context — shared app state (theme, user, i18n)
- Their own data fetching

This avoids prop drilling through the router and encourages
clean React architecture.

**Lazy by default.** Every page-level route should use `lazy`.
Only use `component` for routes that must be eagerly loaded.

**Minimal API.** Routini has 9 exports and nothing more.
No loaders, no actions, no data fetching — just routing.

## What's not in scope

Routini is intentionally small. These features aren't planned — if you need them, reach for a router that does.

| Feature | Use instead |
| --- | --- |
| Data loaders & actions | a data-fetching router |
| Nested layouts | a full-featured router |
| File-based routing | a meta-framework |
| Server-side rendering | planned via `ssrPath` (see Roadmap) |
| Hash & memory routing | a full-featured router |

## Performance

- Lazy loading built in — no boilerplate
- `WeakMap` cache prevents unnecessary remounts
- Routes defined outside components ensure stable references
- `*` catch-all route is always tried last — no performance cost

## Roadmap

- [x] View Transitions API support (`viewTransition` on `Link` / `navigate`)
- [x] Route preloading (`preload="hover" | "render" | "viewport"` on `Link`) —
      also makes View Transitions seamless on lazy routes
- [x] Reactive query params (`useSearchParams`)
- [ ] SSR support via `ssrPath` prop
- [ ] `@routini/vite-plugin` for file-based routing

## Development

This is an npm-workspaces monorepo. The library lives in `packages/routini`; the demo site in `examples/website`.

### Prerequisites

The repo pins a Node version in [`.nvmrc`](.nvmrc) so local builds, contributor machines, and CI all run the same version. If you use [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or [Volta](https://volta.sh), they will read this file automatically:

```bash
# nvm or fnm
nvm use            # or: fnm use

# Volta picks it up automatically when you cd into the repo
```

The root `package.json` also declares `"engines": { "node": ">=20.19.0" }`, so npm will warn if you install with an older Node. The minimum is driven by Vitest's `rolldown` dependency.

### Common commands

Run from the repo root:

| Command | What it does |
| --- | --- |
| `npm install` | Installs every workspace |
| `npm run build` | Builds the library (`tsup`) |
| `npm run dev:package` | Rebuilds the library on change |
| `npm run dev:website` | Starts the demo Vite dev server |
| `npm test` | Runs Vitest across workspaces |
| `npm run lint -w packages/routini` | Lints the library |
| `npm run typecheck -w packages/routini` | Type-checks the library |
| `npm run size -w packages/routini` | Measures the minified + gzipped/brotli size (fails over budget) |

Open two terminals for the typical workflow: `npm run dev:package` and `npm run dev:website`.

### Releasing

Versioning + changelogs are managed by [Changesets](https://github.com/changesets/changesets) in PR-only mode (no `NPM_TOKEN` stored in GitHub — publishes are run manually from a clean checkout).

For any user-visible change:

1. After making your changes on a branch, run `npx changeset` from the repo root.
2. Choose the bump type (`patch` for fixes, `minor` for additions, `major` for breaking changes) and write a short, user-facing summary — this becomes the changelog entry.
3. Commit the generated `.changeset/*.md` file with your PR.
4. When PRs with changesets land on `main`, the release workflow opens (or updates) a "Version Packages" PR that bumps `package.json` and updates `CHANGELOG.md`.
5. Merging that PR is the signal to publish. From a clean checkout: `npm run build && cd packages/routini && npm publish`.

Internal-only changes (refactors with no consumer impact) don't need a changeset.

### Known issues

- **`@arethetypeswrong/cli` is disabled.** It crashes with `Cannot read properties of undefined (reading 'filename')` across versions 0.17.4 and 0.18.2 on every package we tried — local macOS + Node 20, fresh GitHub Actions Ubuntu runners, and third-party packages pulled fresh from npm — so the bug is in attw itself, not our environment or our package shape. `publint` still runs (locally + in CI) and catches the bulk of exports-map mistakes. We'll re-enable attw once a working version ships.
