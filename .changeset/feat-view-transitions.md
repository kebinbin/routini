---
"routini": minor
---

View Transitions support, opt-in per navigation.

`<Link viewTransition>` and `navigate(to, { viewTransition: true })` wrap the
navigation in `document.startViewTransition`, so the browser animates between
the old and new page. The React commit is forced synchronously inside the
transition callback (`flushSync`), which is what makes the animation capture
the new route.

- Progressive enhancement: browsers without the API navigate instantly.
- The animation itself is CSS — customize with `::view-transition-*`
  pseudo-elements or per-element `view-transition-name` for shared-element
  morphs.
- Works best with eager routes: an unloaded lazy chunk animates to the loading
  fallback rather than the page.
