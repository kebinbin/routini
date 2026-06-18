import { useContext, useEffect } from "react";
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
   * in an idle callback so it never competes with the current page's resources.
   * No-op for eager routes and when rendered without a Router above it.
   */
  preload?: "hover" | "render";
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
