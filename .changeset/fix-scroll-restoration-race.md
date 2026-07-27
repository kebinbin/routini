---
"routini": patch
---

Fix `scrollRestoration` not restoring on back/forward in real browsers. A
separate popstate listener decided the scroll target and stashed it for
Router's layout effect to consume — but Router's own popstate-driven
re-render could win the race and run first, finding nothing queued.
The layout effect now reads `history.state` directly when it runs, so
there's a single code path and no listener to race.
