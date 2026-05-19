# routini

A tiny, TypeScript-first router for React.

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

## Performance

- Lazy loading built in — no boilerplate
- `WeakMap` cache prevents unnecessary remounts
- Routes defined outside components ensure stable references
- `*` catch-all route is always tried last — no performance cost

## Roadmap

- [ ] Link prefetching on hover (`preload="hover"`)
- [ ] SSR support via `ssrPath` prop
- [ ] View Transitions API support
- [ ] `@routini/vite-plugin` for file-based routing

## Development

This is an npm-workspaces monorepo. The library lives in `packages/routini`; the demo site in `examples/website`.

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
