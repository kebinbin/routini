---
"routini": patch
---

Swap `path-to-regexp` for `regexparam` as the route matcher.

routini only ever exposed exact / `:param` / `*` matching, so path-to-regexp's
heavier features (custom per-param regex, optional/repeated modifiers) were
unused weight. `regexparam` covers the same surface in a fraction of the size,
dropping the whole library from ~3.3 KB to ~1.4 KB gzipped (dependencies
included).

Two minor behavior changes inherited from regexparam: paths now match
case-insensitively and tolerate an optional trailing slash. URL-encoded params
are still decoded. All existing matching tests pass unchanged.
