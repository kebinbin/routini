import { flushSync } from "react-dom";

/**
 * Run `update` wrapped in a View Transition when the browser supports it,
 * otherwise run it directly (instant navigation, same code path).
 *
 * The browser snapshots the page, runs the callback, then animates between the
 * snapshots — so the React commit inside `update` has to land *synchronously*
 * for the new state to be captured. `flushSync` forces that; React's default
 * batching would otherwise commit after the snapshot is taken.
 *
 * This is the one deliberate `react-dom` import in the library (see CLAUDE.md).
 * Shared by `navigate()` (forward navigation) and Router's back/forward handler.
 */
export function withViewTransition(update: () => void) {
  if (typeof document !== "undefined" && document.startViewTransition) {
    document.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}
