import { SCROLL_RESTORATION_STATE_KEY as KEY } from "../consts";

/**
 * Scroll restoration — opt-in via `<Router scrollRestoration>`. Standard SPA
 * behavior: scroll to top on a forward navigation, restore the saved offset on
 * back/forward. Each history entry carries an id in `history.state`; a passive
 * scroll listener caches the offset per id so it's ready to re-apply on return.
 *
 * Scrolls the window by default; pass `<Router scrollContainer={ref}>` for an
 * app that scrolls a nested element instead (e.g. a `<main>` inside a fixed
 * layout).
 *
 * The scroll decision reads `history.state` directly (see `applyScroll`) rather
 * than through a separate popstate listener — so it can't race Router's own
 * location subscription. Router's layout effect, keyed on the pathname, is the
 * single driver, which also means query-only navigations (search params) never
 * reset scroll.
 */

// The scroll container: the window, or a nested scrollable element.
type Target = Element | Window;
type GetTarget = () => Target;

const positions = new Map<number, number>();
let nextId = 1;
let currentId = 0;
// Pathname applyScroll last acted on. Guards the initial mount (and StrictMode's
// double-invoke) from scrolling — we only scroll on an actual pathname change.
let appliedPathname = "";
let refs = 0;
let getTarget: GetTarget = () => window;
let prevNativeRestoration: History["scrollRestoration"] | undefined;

const offsetOf = (t: Target) =>
  t === window ? window.scrollY : (t as Element).scrollTop;
// "instant" forces a jump regardless of the page's own `scroll-behavior: smooth`
// (e.g. for anchor links) — restoration emulates native navigation, which never
// animates: a fresh page load doesn't glide to the top, and back/forward doesn't
// glide to the old position, it just lands there.
const scrollTargetTo = (t: Target, top: number) =>
  t.scrollTo({ top, behavior: "instant" });

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

// Keep the current entry's cached offset up to date, so it's already saved by
// the time we navigate away from it.
function trackScroll() {
  if (currentId) positions.set(currentId, offsetOf(getTarget()));
}

/**
 * Start caching scroll offsets; returns a teardown. No-op under SSR.
 * `resolveTarget` returns the scroll container (window by default) and is read
 * lazily, so it always sees the live element even if it mounts after the Router.
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
    currentId = entryId() ?? assignId();
    getTarget().addEventListener("scroll", trackScroll, { passive: true });
  }
  return () => {
    if (--refs > 0) return;
    getTarget().removeEventListener("scroll", trackScroll);
    appliedPathname = "";
    if (prevNativeRestoration && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = prevNativeRestoration;
    }
  };
}

/**
 * Apply scroll for the just-committed route. Called from Router's layout effect
 * on each pathname change, so the content is laid out first. Reads the target
 * from `history.state`: a brand-new entry (no id) is a forward nav → top; a
 * revisited entry (has an id) is back/forward → its saved offset. Reading state
 * here — not in a popstate listener — is what makes restoration independent of
 * listener ordering. The initial mount only establishes the id (no scroll); hash
 * targets are left to routini's ScrollToHash.
 */
export function applyScroll(resolveTarget: GetTarget) {
  if (typeof window === "undefined" || window.location.hash) return;

  const { pathname } = window.location;
  // Skip the first apply (mount) and StrictMode's re-run of it — only an actual
  // pathname change should move the scroll position.
  const skip = appliedPathname === "" || pathname === appliedPathname;
  appliedPathname = pathname;

  const existing = entryId();
  currentId = existing ?? assignId();
  if (skip) return;

  scrollTargetTo(resolveTarget(), existing === undefined ? 0 : positions.get(existing) ?? 0);
}
