---
"routini": minor
---

Add opt-in scroll restoration via `<Router scrollRestoration>`.

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
