---
"routini": minor
---

Add `replace` navigation, and make `<Navigate>` replace by default.

`navigate(to, { replace: true })` and `<Link replace>` swap the current history
entry instead of pushing a new one. `<Navigate>` — a declarative redirect — now
**replaces by default**: with a pushed entry, the back button returned to the
route that redirected away, which immediately redirected forward again (a
back-button trap). Pass `replace={false}` to push instead.

`Link` clicks and `navigate()` calls still push by default — normal navigation
is unchanged. New type-only export `NavigateOptions`.
