---
"routini": minor
---

Add a built-in error boundary so a failed lazy route no longer white-screens the app.

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
