---
"routini": patch
---

Enable tree-shaking and fix internal event name collision.

`sideEffects: false` is now set in `package.json`, allowing bundlers to
drop unused exports from the final bundle.

The internal custom event was renamed from `pushstate` to `routini:navigate`
to avoid shadowing the native `pushstate` browser event name.
