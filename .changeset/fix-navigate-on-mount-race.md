---
"routini": patch
---

Fix `<Navigate />` in the initial route tree silently failing on first paint.

Previously, when `<Navigate />` was used as the matched component for the initial URL (e.g. `/` → redirect to `/en`), the URL would update via `history.pushState` but Router's internal state would not, leaving the stale `<Navigate />` rendered in the Outlet. The user had to refresh to see the destination page.

The root cause was a race in the old `useState + useEffect` pattern: React effects run child-first, so `<Navigate />` fired its `navigate()` in `useEffect` before the parent `Router`'s `useEffect` attached its `routini:navigate` event listener. The event fired with no listener attached, so Router missed the update.

Router now uses React 18's `useSyncExternalStore` to subscribe to `window.location.pathname`. React re-reads the snapshot after every commit, so any drift between rendered state and the live URL is reconciled automatically — the race can't happen.
