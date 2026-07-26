import { EVENTS, SCROLL_RESTORATION_STATE_KEY as KEY } from "../consts";

/**
 * Scroll restoration — opt-in via `<Router scrollRestoration>`. Standard SPA
 * behavior: scroll to top on a forward navigation, restore the saved offset on
 * back/forward. Each history entry carries an id in `history.state`; a passive
 * scroll listener caches the offset per id so it's ready to re-apply on return.
 *
 * Scrolls the window by default; pass `<Router scrollContainer={ref}>` for an
 * app that scrolls a nested element instead (e.g. a `<main>` inside a fixed
 * layout). A pathname-keyed apply (see Router) means query-only navigations
 * (search params) don't reset scroll; only pathname changes do.
 */

// The scroll container: the window, or a nested scrollable element.
type Target = Element | Window;
type GetTarget = () => Target;

// What the next committed pathname change should do: scroll to top (forward
// nav), restore a saved offset (back/forward), or nothing.
type Pending = number | "top" | null;

const positions = new Map<number, number>();
let nextId = 1;
let currentId = 0;
let prevPathname = "";
let pending: Pending = null;
let refs = 0;
let getTarget: GetTarget = () => window;
let prevNativeRestoration: History["scrollRestoration"] | undefined;

const offsetOf = (t: Target) => (t === window ? window.scrollY : (t as Element).scrollTop);
// "instant" forces a jump regardless of the page's own `scroll-behavior: smooth`
// (e.g. for anchor links) — restoration emulates native navigation, which never
// animates: a fresh page load doesn't glide to the top, and back/forward doesn't
// glide to the old position, it just lands there.
const scrollTargetTo = (t: Target, top: number) => t.scrollTo({ top, behavior: "instant" });

function entryId(): number | undefined {
  const id = (window.history.state as Record<string, unknown> | null)?.[KEY];
  return typeof id === "number" ? id : undefined;
}

// Assign a fresh id to the current entry, preserving any existing state.
function assignId(): number {
  const id = nextId++;
  window.history.replaceState({ ...window.history.state, [KEY]: id }, "");
  return id;
}

// Keep the current entry's cached offset current, so it's already saved by the
// time we navigate away from it.
function trackScroll() {
  if (currentId) positions.set(currentId, offsetOf(getTarget()));
}

function onLocationChange() {
  const { pathname } = window.location;
  if (pathname === prevPathname) return; // query/hash-only change: leave scroll alone
  prevPathname = pathname;

  const existing = entryId();
  if (existing === undefined) {
    currentId = assignId(); // brand-new entry → forward nav
    pending = "top";
  } else {
    currentId = existing; // revisited entry → back/forward
    pending = positions.get(existing) ?? 0;
  }
}

/**
 * Start restoring scroll; returns a teardown. No-op under SSR. `resolveTarget`
 * returns the scroll container (window by default) and is read lazily, so it
 * always sees the live element even if it mounts after the Router.
 */
export function installScrollRestoration(resolveTarget: GetTarget): () => void {
  if (typeof window === "undefined") return () => {};
  getTarget = resolveTarget;
  if (refs++ === 0) {
    // Take over from the browser's own restoration so the two don't fight.
    prevNativeRestoration = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    prevPathname = window.location.pathname;
    currentId = entryId() ?? assignId();
    getTarget().addEventListener("scroll", trackScroll, { passive: true });
    window.addEventListener(EVENTS.NAVIGATE, onLocationChange);
    window.addEventListener(EVENTS.POPSTATE, onLocationChange);
  }
  return () => {
    if (--refs > 0) return;
    getTarget().removeEventListener("scroll", trackScroll);
    window.removeEventListener(EVENTS.NAVIGATE, onLocationChange);
    window.removeEventListener(EVENTS.POPSTATE, onLocationChange);
    if (prevNativeRestoration && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = prevNativeRestoration;
    }
  };
}

/**
 * Apply the scroll queued by the last pathname change, after the route commits.
 * Hash targets are left to routini's ScrollToHash. Called from Router's layout
 * effect so the content is laid out before we scroll.
 */
export function applyPendingScroll() {
  if (pending === null || window.location.hash) {
    pending = null;
    return;
  }
  scrollTargetTo(getTarget(), pending === "top" ? 0 : pending);
  pending = null;
}
