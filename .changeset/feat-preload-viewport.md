---
"routini": minor
---

Add `<Link preload="viewport">` — warm a lazy route's chunk when the link
scrolls into view.

Joins the existing `preload="hover"` and `preload="render"`. Every viewport link
shares a single `IntersectionObserver` (not one per link), so a page with many
links stays cheap; each link fires once, then stops observing. Feature-detected —
a no-op where `IntersectionObserver` is unavailable, where the route is eager
(nothing to fetch), and when rendered without a Router above it. No new exports.

Pair it with View Transitions so a link that's already in view animates straight
to the real page instead of the loading fallback.
