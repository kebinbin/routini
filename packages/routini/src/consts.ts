export const EVENTS = {
  NAVIGATE: "routini:navigate",
  POPSTATE: "popstate",
};

/**
 * Marker written into `history.state` when a navigation animates. Back/forward
 * (popstate) has no call site to carry a `viewTransition` intent, so it reads
 * this flag off the destination entry instead: animate iff the entry was
 * reached by an animated navigation.
 */
export const VIEW_TRANSITION_STATE_KEY = "routiniViewTransition";

/**
 * Key written into `history.state` to give each entry a stable id, so opt-in
 * scroll restoration can cache and restore a scroll offset per entry. See
 * `utils/scrollRestoration.ts`.
 */
export const SCROLL_RESTORATION_STATE_KEY = "routiniScrollId";
