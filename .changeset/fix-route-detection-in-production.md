---
"routini": patch
---

Fix `<Route>` children not being recognised in production builds.

Previously, `Router` identified `<Route>` children by checking `component.type.name === "Route"`. Minifiers mangle function names in production, so the check silently failed — routes defined as JSX children were ignored and nothing rendered.

`Route` is now tagged with `Symbol.for("routini.Route")` on its `$$marker` property. The `isRouteType()` guard checks for that symbol instead of the function name. `Symbol.for` is deterministic and survives minification.

All five public components (`Router`, `Route`, `Link`, `Outlet`, `Navigate`) also now have explicit `displayName` properties so React DevTools shows real names in production.
