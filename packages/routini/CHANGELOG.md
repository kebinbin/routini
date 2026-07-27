# routini

## 0.2.2

### Patch Changes

- 6623c81: Fix `scrollRestoration` not restoring on back/forward in real browsers. A
  separate popstate listener decided the scroll target and stashed it for
  Router's layout effect to consume — but Router's own popstate-driven
  re-render could win the race and run first, finding nothing queued.
  The layout effect now reads `history.state` directly when it runs, so
  there's a single code path and no listener to race.

## 0.2.1

### Patch Changes

- ec6c775: Fix `scrollRestoration` animating instead of jumping when the page sets
  `scroll-behavior: smooth` in CSS (e.g. for anchor links). Restoration now
  always scrolls instantly, matching native browser navigation.

## 0.2.0

### Minor Changes

- 016b48b: Expose `package.json` in the `exports` map, so consumers can read the installed
  version without hand-maintaining a copy.

  ```ts
  import { version } from "routini/package.json";
  ```

- 016b48b: Add opt-in scroll restoration via `<Router scrollRestoration>`.

  Scrolls to the top on a forward navigation and restores the previous scroll
  position on back/forward — the behavior most SPAs want, which the router is the
  right place to own since only it knows the navigation type (push vs. pop).

  ```tsx
  // window scroll (the common case)
  <Router routes={routes} scrollRestoration />

  // a nested scroll container instead of the window
  const ref = useRef<HTMLElement>(null);
  <Router routes={routes} scrollRestoration scrollContainer={ref} />
  <main ref={ref}>…</main>
  ```

  Each history entry is keyed in `history.state`, and offsets are cached per entry
  and re-applied on return. Keyed on the pathname, so query-only navigations
  (search params) don't reset scroll. Off by default; add nothing to opt out.

## 0.1.0

### Minor Changes

- 7ffe24d: Add route preloading: `<Link preload="hover" | "render">`.

  `preload="hover"` warms a lazy route's code-split chunk on pointer-enter or
  keyboard focus (the user has signalled intent); `preload="render"` warms it when
  the link mounts, scheduled in an idle callback so it never competes with the
  current page's own loading. Each chunk is fetched at most once, however many
  links point at it, and it's a no-op for eager routes (nothing to fetch). Pair it
  with View Transitions so navigating to a lazy route animates to the real page
  instead of the loading fallback.

  Also adds a development-only warning when the `routes` prop changes identity
  between renders **and** contains lazy routes — the case that silently remounts
  pages and loses their state.

  No new runtime exports.

- af9dd5d: Add `replace` navigation, and make `<Navigate>` replace by default.

  `navigate(to, { replace: true })` and `<Link replace>` swap the current history
  entry instead of pushing a new one. `<Navigate>` — a declarative redirect — now
  **replaces by default**: with a pushed entry, the back button returned to the
  route that redirected away, which immediately redirected forward again (a
  back-button trap). Pass `replace={false}` to push instead.

  `Link` clicks and `navigate()` calls still push by default — normal navigation
  is unchanged. New type-only export `NavigateOptions`.

- 6857bd8: Add `<Link preload="viewport">` — warm a lazy route's chunk when the link
  scrolls into view.

  Joins the existing `preload="hover"` and `preload="render"`. Every viewport link
  shares a single `IntersectionObserver` (not one per link), so a page with many
  links stays cheap; each link fires once, then stops observing. Feature-detected —
  a no-op where `IntersectionObserver` is unavailable, where the route is eager
  (nothing to fetch), and when rendered without a Router above it. No new exports.

  Pair it with View Transitions so a link that's already in view animates straight
  to the real page instead of the loading fallback.

- a8d94e2: Add a built-in error boundary so a failed lazy route no longer white-screens the app.

  Lazy routes can fail to load — most often a stale chunk after a deploy, or a
  network blip. Suspense doesn't catch this (it only catches suspension), so a
  failed `import()` previously unmounted the whole tree. `Router` now wraps every
  route in an internal error boundary that catches failed chunk loads **and**
  render errors, and recovers automatically when you navigate elsewhere.

  Two new optional `<Router>` props (no new runtime exports; the boundary is internal):

  - `errorFallback` — a `ReactNode`, or a function `({ error, reset, reload, isChunkError }) => ReactNode`. `reset()` retries the route in place (re-runs a failed lazy import, keeps app state); `reload()` hard-reloads (routini never calls it itself); `isChunkError` distinguishes a failed code-split download from a render bug. Defaults to a minimal message.
  - `onError(error, info)` — logging/telemetry hook.

  New type-only export `ErrorFallbackContext`. routini deliberately does not
  auto-reload or write to storage — it surfaces the error and lets you decide.

- 6857bd8: Add `useSearchParams` — a reactive query-string hook.

  ```ts
  const [params, setParams] = useSearchParams();
  params.get("q"); // read the current ?query
  setParams({ q: "routers" }); // navigate with a new query (push by default)
  setParams(prev, { replace: true });
  ```

  Returns the current `URLSearchParams` and a setter. The setter navigates to the
  current pathname with the new query and accepts the usual navigate options
  (`replace`, `viewTransition`).

  This closes a real gap: routini's location store tracks the pathname only (so a
  query-only navigation doesn't remount the matched route), which meant a
  component reading the query directly went stale on a query-only change. The hook
  keeps its own subscription to the same navigation events, so components that read
  the query stay in sync while everything else is untouched by a query change.

  `useSearchParams` is the library's 8th export.

- af9dd5d: View Transitions support, opt-in per navigation.

  `<Link viewTransition>` and `navigate(to, { viewTransition: true })` wrap the
  navigation in `document.startViewTransition`, so the browser animates between
  the old and new page. The React commit is forced synchronously inside the
  transition callback (`flushSync`), which is what makes the animation capture
  the new route.

  - Progressive enhancement: browsers without the API navigate instantly.
  - The animation itself is CSS — customize with `::view-transition-*`
    pseudo-elements or per-element `view-transition-name` for shared-element
    morphs.
  - Works best with eager routes: an unloaded lazy chunk animates to the loading
    fallback rather than the page.

- fa4b0cd: Drop the route-matcher dependency, animate back/forward navigations, and render preloaded lazy routes without a flash.

  **Dependency-free matcher.** routini's matching surface is only static segments,
  `:param`, and a single `*` catch-all, so it no longer needs a path-matching
  dependency — a small hand-rolled segment matcher covers exactly that surface.
  **routini now has zero runtime dependencies** (only the `react`/`react-dom`
  peers). One behavior change: **matching is now case-sensitive** — `/About` no
  longer matches a `/about` route, the correct web default. Trailing-slash
  tolerance and `decodeURIComponent` on params are unchanged.

  **Back/forward View Transitions.** When a forward navigation animates (via
  `<Link viewTransition>` or `navigate(to, { viewTransition: true })`), the back
  and forward buttons now replay that same transition automatically — no new API.
  The intent is recorded in `history.state` on both ends of the animated edge and
  read back on `popstate`, so back/forward inherits exactly what the forward
  navigation did, and only animated edges animate.

  **No fallback flash on preloaded routes.** routini now resolves lazy chunks
  itself instead of deferring to `React.lazy`, so a route whose chunk is already
  warm (for example via `<Link preload>`) renders synchronously instead of
  flashing the Suspense fallback for one frame. A preloaded View Transition now
  lands directly on the real page.

### Patch Changes

- cc868c9: Add hash-anchor navigation to `Link`.

  `Link` previously called `preventDefault()` on every same-window primary
  click, which blocked the browser's native scroll-to-anchor. Now:

  - `to="#section"` — pure hash links are left to the browser to scroll natively.
  - `to="/docs#section"` — routini navigates to the path, then scrolls to the
    element with that `id` once the matched route has committed.

  Scrolling is driven by an internal effect inside the route content (so it
  works for lazy routes once Suspense resolves, and for deep links on first
  load) rather than a timer. No new exports; the public API is unchanged.

- 3522636: Add `ssrPath` prop to `<Router>` for server-side rendering support.

  `Router` now initialises `currentPath` lazily and falls back to `ssrPath` when `window` is undefined (e.g. in a Node/SSR environment). The `navigate()` utility also early-returns safely under SSR.

  This is a non-breaking addition — existing client-only usage is unchanged.

- 252c105: Fix `<Navigate />` in the initial route tree silently failing on first paint.

  Previously, when `<Navigate />` was used as the matched component for the initial URL (e.g. `/` → redirect to `/en`), the URL would update via `history.pushState` but Router's internal state would not, leaving the stale `<Navigate />` rendered in the Outlet. The user had to refresh to see the destination page.

  The root cause was a race in the old `useState + useEffect` pattern: React effects run child-first, so `<Navigate />` fired its `navigate()` in `useEffect` before the parent `Router`'s `useEffect` attached its `routini:navigate` event listener. The event fired with no listener attached, so Router missed the update.

  Router now uses React 18's `useSyncExternalStore` to subscribe to `window.location.pathname`. React re-reads the snapshot after every commit, so any drift between rendered state and the live URL is reconciled automatically — the race can't happen.

- 3522636: Fix `<Route>` children not being recognised in production builds.

  Previously, `Router` identified `<Route>` children by checking `component.type.name === "Route"`. Minifiers mangle function names in production, so the check silently failed — routes defined as JSX children were ignored and nothing rendered.

  `Route` is now tagged with `Symbol.for("routini.Route")` on its `$$marker` property. The `isRouteType()` guard checks for that symbol instead of the function name. `Symbol.for` is deterministic and survives minification.

  All five public components (`Router`, `Route`, `Link`, `Outlet`, `Navigate`) also now have explicit `displayName` properties so React DevTools shows real names in production.

- 3522636: Enable tree-shaking and fix internal event name collision.

  `sideEffects: false` is now set in `package.json`, allowing bundlers to
  drop unused exports from the final bundle.

  The internal custom event was renamed from `pushstate` to `routini:navigate`
  to avoid shadowing the native `pushstate` browser event name.
