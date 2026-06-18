---
"routini": minor
---

Drop the route-matcher dependency, animate back/forward navigations, and render preloaded lazy routes without a flash.

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
