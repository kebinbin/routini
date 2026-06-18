import { useContext, useEffect, useRef } from "react";
import { RouterContext } from "../context/RouterContext";
import { navigate } from "../utils/navigate";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  /**
   * Animate this navigation with the View Transitions API. Ignored (instant
   * navigation) in browsers without `document.startViewTransition`.
   */
  viewTransition?: boolean;
  /**
   * Preload this route's code-split chunk ahead of navigation so the page is
   * ready on click. "hover" preloads on pointer-enter or keyboard focus (the
   * user signalled intent); "render" preloads when the link mounts, scheduled
   * in an idle callback so it never competes with the current page's resources;
   * "viewport" preloads when the link scrolls into view (via
   * IntersectionObserver). No-op for eager routes, when rendered without a
   * Router above it, and (for "viewport") where IntersectionObserver is absent.
   */
  preload?: "hover" | "render" | "viewport";
}

// Every preload="viewport" link shares ONE IntersectionObserver, keyed to its
// element via a WeakMap of preload callbacks — a page with 100 links uses one
// observer, not 100 (the Next.js <Link> approach). Each link fires once: on
// first intersection we run its preload, then stop observing it.
const viewportPreloads = new WeakMap<Element, () => void>();
let viewportObserver: IntersectionObserver | null = null;

function observeViewport(el: Element, preload: () => void): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};
  viewportObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      viewportObserver!.unobserve(entry.target);
      viewportPreloads.get(entry.target)?.();
      viewportPreloads.delete(entry.target);
    }
  });
  viewportPreloads.set(el, preload);
  viewportObserver.observe(el);
  return () => {
    viewportObserver?.unobserve(el);
    viewportPreloads.delete(el);
  };
}

export function Link({
  target,
  to,
  replace,
  viewTransition,
  preload,
  onMouseEnter,
  onFocus,
  ...props
}: LinkProps) {
  const { preloadPath } = useContext(RouterContext);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) return;
    if (target !== undefined && target !== "_self") return;
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    // Pure hash link (e.g. to="#section"): let the browser scroll natively.
    if (to.startsWith("#")) return;

    // Path links navigate in-app. Any #hash stays in the URL so Router's
    // ScrollToHash can scroll to it once the matched route has committed.
    e.preventDefault();
    navigate(to, { replace, viewTransition });
  };

  // "render": warm the chunk once the link mounts, yielding to the current page
  // via an idle callback (setTimeout fallback for browsers without rIC).
  useEffect(() => {
    if (preload !== "render") return;
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
      setTimeout: (cb: () => void, ms: number) => number;
      clearTimeout: (id: number) => void;
    };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => w.setTimeout(cb, 1));
    const cancel = w.cancelIdleCallback ?? w.clearTimeout;
    const id = schedule(() => preloadPath(to));
    return () => cancel(id);
  }, [preload, to, preloadPath]);

  // "viewport": warm the chunk when the link scrolls into view, through the one
  // shared observer (see observeViewport). Cleanup stops observing on unmount.
  useEffect(() => {
    const el = linkRef.current;
    if (preload !== "viewport" || !el) return;
    return observeViewport(el, () => preloadPath(to));
  }, [preload, to, preloadPath]);

  // "hover": preload on intent (pointer-enter or keyboard focus). Compose with
  // any consumer-provided handlers rather than clobbering them.
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preload === "hover") preloadPath(to);
    onMouseEnter?.(e);
  };
  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (preload === "hover") preloadPath(to);
    onFocus?.(e);
  };

  return (
    <a
      ref={linkRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      href={to}
      target={target}
      {...props}
    />
  );
}

Link.displayName = "Link";
