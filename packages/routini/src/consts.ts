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
