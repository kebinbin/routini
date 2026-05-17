# routini

A minimal Typescript-first router for React.
A tiny, TypeScript-first React router with lazy loading built in.

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
