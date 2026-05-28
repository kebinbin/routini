---
"routini": patch
---

Add `ssrPath` prop to `<Router>` for server-side rendering support.

`Router` now initialises `currentPath` lazily and falls back to `ssrPath` when `window` is undefined (e.g. in a Node/SSR environment). The `navigate()` utility also early-returns safely under SSR.

This is a non-breaking addition — existing client-only usage is unchanged.
