import { flushSync } from "react-dom";
import { EVENTS } from "../consts";

export interface NavigateOptions {
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  /**
   * Animate this navigation with the View Transitions API. Ignored (instant
   * navigation) in browsers without `document.startViewTransition`.
   */
  viewTransition?: boolean;
}

/**
 * Navigate programmatically by updating the history stack and dispatching a
 * custom event to notify the Router about the change.
 */
export function navigate(to: string, options: NavigateOptions = {}) {
  if (typeof window === "undefined") return;

  const update = () => {
    // Update the URL without reloading the page.
    window.history[options.replace ? "replaceState" : "pushState"]({}, "", to);
    window.dispatchEvent(new Event(EVENTS.NAVIGATE)); // Emit event to listening router.
  };

  // startViewTransition snapshots the page, runs the callback, then animates
  // between the snapshots — so the React commit for the new route has to land
  // synchronously inside the callback. flushSync forces that; React's default
  // batching would otherwise commit after the snapshot is taken.
  if (options.viewTransition && document.startViewTransition) {
    document.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}
