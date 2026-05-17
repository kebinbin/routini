import { EVENTS } from "../consts";

/**
 * Navigate programmatically by pushing a new entry into the history stack
 * and dispatching a custom event to notify the Router about the change.
 */
export function navigate(to: string) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event(EVENTS.PUSHSTATE));
}
