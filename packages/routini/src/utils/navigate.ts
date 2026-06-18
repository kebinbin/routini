import { EVENTS, VIEW_TRANSITION_STATE_KEY } from "../consts";
import { withViewTransition } from "./viewTransition";

export interface NavigateOptions {
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  /**
   * Animate this navigation with the View Transitions API. Ignored (instant
   * navigation) in browsers without `document.startViewTransition`.
   *
   * Back/forward to the resulting entry replays the transition automatically —
   * the entry is tagged in `history.state`, so popstate inherits the intent.
   */
  viewTransition?: boolean;
}

/**
 * Navigate programmatically by updating the history stack and dispatching a
 * custom event to notify the Router about the change.
 */
export function navigate(to: string, options: NavigateOptions = {}) {
  if (typeof window === "undefined") return;

  const { replace, viewTransition } = options;

  // When animating, record it in history.state so a later back/forward to this
  // entry replays the transition (popstate has no call site to carry the intent).
  const state = viewTransition ? { [VIEW_TRANSITION_STATE_KEY]: true } : {};

  const update = () => {
    // Tag the entry we're leaving too (same URL), so going *back* to it also
    // animates — both ends of an animated edge carry the flag. Skipped on
    // replace, where there's no separate entry to return to.
    if (viewTransition && !replace) {
      window.history.replaceState(state, "", window.location.href);
    }
    window.history[replace ? "replaceState" : "pushState"](state, "", to);
    window.dispatchEvent(new Event(EVENTS.NAVIGATE)); // Emit event to listening router.
  };

  if (viewTransition) {
    withViewTransition(update);
  } else {
    update();
  }
}
