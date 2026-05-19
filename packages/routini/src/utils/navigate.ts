import { EVENTS } from "../consts";

/**
 * Navigate programmatically by pushing a new entry into the history stack
 * and dispatching a custom event to notify the Router about the change.
 */
export function navigate(to: string) {
  if (typeof window === "undefined") return;
  window.history.pushState({}, "", to); // Update the URL without reloading the page
  window.dispatchEvent(new Event(EVENTS.NAVIGATE)); // Emit event to listening router.
}
