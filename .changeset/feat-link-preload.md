---
"routini": minor
---

Add route preloading: `<Link preload="hover" | "render">`.

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
