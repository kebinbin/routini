---
"routini": patch
---

Fix `scrollRestoration` animating instead of jumping when the page sets
`scroll-behavior: smooth` in CSS (e.g. for anchor links). Restoration now
always scrolls instantly, matching native browser navigation.
