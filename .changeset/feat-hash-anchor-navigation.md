---
"routini": patch
---

Add hash-anchor navigation to `Link`.

`Link` previously called `preventDefault()` on every same-window primary
click, which blocked the browser's native scroll-to-anchor. Now:

- `to="#section"` — pure hash links are left to the browser to scroll natively.
- `to="/docs#section"` — routini navigates to the path, then scrolls to the
  element with that `id` once the matched route has committed.

Scrolling is driven by an internal effect inside the route content (so it
works for lazy routes once Suspense resolves, and for deep links on first
load) rather than a timer. No new exports; the public API is unchanged.
