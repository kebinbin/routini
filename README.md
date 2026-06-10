# routini

A tiny, TypeScript-first router for React.

> Small to ship, solid to type, scoped to one job, free of setup ceremony.

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

Two optional props beyond the standard `<a>` attributes:

```tsx
<Link to="/dashboard" replace>Dashboard</Link>          {/* replace the history entry */}
<Link to="/album/9" viewTransition>Open album</Link>    {/* animate the navigation */}
```

- `replace` — swap the current history entry instead of pushing a new one.
- `viewTransition` — animate the navigation with the View Transitions API
  (see [View Transitions](#view-transitions)); browsers without support
  navigate instantly.

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
- **Works best with eager routes.** On a lazy route whose chunk isn't loaded
  yet, the transition animates to the loading fallback rather than the page.
  Keep view-transition targets eager, or pair with route preloading when it
  lands (see Roadmap).

## Philosophy

**Pages are self-contained.** Routes get their data from:

- `useParams()` — route parameters
- `useLocation()` — current path
- React context — shared app state (theme, user, i18n)
- Their own data fetching

This avoids prop drilling through the router and encourages
clean React architecture.

**Lazy by default.** Every page-level route should use `lazy`.
Only use `component` for routes that must be eagerly loaded.

**Minimal API.** Routini has 7 exports and nothing more.
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
- [ ] Link prefetching on hover (`preload="hover"`) — also makes view
      transitions seamless on lazy routes
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
