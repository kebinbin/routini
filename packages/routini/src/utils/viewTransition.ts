import { flushSync } from "react-dom";

/**
 * Wraps `update` in a View Transition when the browser supports it, else
 * runs it directly (instant navigation, same code path).
 *
 * The browser snapshots the page, runs `update`, then snapshots again to
 * animate between them — so the commit inside `update` must land
 * *synchronously*, before the second snapshot. `flushSync` forces that
 * past React's default batching.
 */
export function withViewTransition(update: () => void) {
  if (typeof document !== "undefined" && document.startViewTransition) {
    document.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}
