---
"routini": minor
---

Add `useSearchParams` — a reactive query-string hook.

```ts
const [params, setParams] = useSearchParams();
params.get("q");                 // read the current ?query
setParams({ q: "routers" });     // navigate with a new query (push by default)
setParams(prev, { replace: true });
```

Returns the current `URLSearchParams` and a setter. The setter navigates to the
current pathname with the new query and accepts the usual navigate options
(`replace`, `viewTransition`).

This closes a real gap: routini's location store tracks the pathname only (so a
query-only navigation doesn't remount the matched route), which meant a
component reading the query directly went stale on a query-only change. The hook
keeps its own subscription to the same navigation events, so components that read
the query stay in sync while everything else is untouched by a query change.

`useSearchParams` is the library's 8th export.
