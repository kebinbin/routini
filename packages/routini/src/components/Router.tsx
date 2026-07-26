/* eslint-disable react-hooks/static-components */
import {
  useSyncExternalStore,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useCallback,
  useMemo,
  Children,
  Suspense,
} from "react";
import { EVENTS, VIEW_TRANSITION_STATE_KEY } from "../consts";
import { RouterContext } from "../context/RouterContext";
import { matchRoute } from "../utils/matchRoute";
import { isRouteType } from "./Route";
import { RouteErrorBoundary, type ErrorFallback } from "./RouteErrorBoundary";
import { markChunkError } from "../utils/isChunkError";
import { withViewTransition } from "../utils/viewTransition";
import {
  installScrollRestoration,
  applyPendingScroll,
} from "../utils/scrollRestoration";

export type DynamicImport = () => Promise<{ default: React.ComponentType }>;

export interface RouteDefinition {
  path: string;
  component?: React.ComponentType;
  lazy?: DynamicImport;
  loading?: React.ReactNode;
}

export interface RouterProps {
  routes?: RouteDefinition[];
  loading?: React.ReactNode;
  children?: React.ReactNode;
  /** Initial path to use during server-side rendering (where `window` is undefined). */
  ssrPath?: string;
  /**
   * What to render when a route fails to load (a code-split chunk that won't
   * download) or throws while rendering. A node, or a function that receives
   * `{ error, reset, reload, isChunkError }`. Defaults to a minimal message.
   */
  errorFallback?: ErrorFallback;
  /** Called when a route errors — for logging/telemetry (e.g. Sentry). */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /**
   * Opt in to scroll restoration: scroll to top on a forward navigation,
   * restore the previous position on back/forward. Scrolls the window unless
   * `scrollContainer` is given.
   */
  scrollRestoration?: boolean;
  /**
   * The scrollable element to restore, when it isn't the window — e.g. a
   * `<main>` inside a fixed layout. Only used with `scrollRestoration`.
   */
  scrollContainer?: React.RefObject<Element | null>;
}

// Lazy-route resolution keyed by import thunk. routini resolves chunks itself
// (not via React.lazy) so a *preloaded* route renders synchronously on
// navigation — React.lazy always suspends one frame on first render, flashing
// the fallback even when the chunk is already cached.
type LazyEntry =
  | { status: "pending"; promise: Promise<unknown> }
  | { status: "resolved"; Component: React.ComponentType }
  | { status: "rejected"; error: unknown };

const lazyEntries = new WeakMap<DynamicImport, LazyEntry>();

// Stable wrapper per thunk (a new identity each render would remount the page).
const lazyComponentsCache = new WeakMap<DynamicImport, React.ComponentType>();

// Start (or reuse) a thunk's import, recording its state as it settles.
// Idempotent, so a hover preload and the later navigation share one import.
function loadLazy(dynamicImport: DynamicImport): LazyEntry {
  const existing = lazyEntries.get(dynamicImport);
  if (existing) return existing;

  const promise = dynamicImport().then(
    (module) => {
      if (!module.default) {
        const error = new Error(
          "Lazy route module must have a default export. Did you forget to add `export default`?",
        );
        lazyEntries.set(dynamicImport, { status: "rejected", error });
        throw error;
      }
      lazyEntries.set(dynamicImport, {
        status: "resolved",
        Component: module.default,
      });
    },
    (cause) => {
      // Failed dynamic import() — tag it so the error boundary recognises it.
      const error = markChunkError(cause);
      lazyEntries.set(dynamicImport, { status: "rejected", error });
      throw error;
    },
  );
  // Recorded on the entry above; swallow so a failed preload isn't an unhandled
  // rejection — navigation re-surfaces it via the entry.
  promise.catch(() => {});

  const entry: LazyEntry = { status: "pending", promise };
  lazyEntries.set(dynamicImport, entry);
  return entry;
}

// Resolve a route's chunk ahead of navigation so a preloaded route renders with
// no fallback. Idempotent.
function preloadRoute(dynamicImport: DynamicImport) {
  loadLazy(dynamicImport);
}

/**
 * Subscribe to URL changes. Module-level so its identity is stable across
 * renders (otherwise useSyncExternalStore would re-subscribe every render).
 */
function subscribeToLocation(callback: () => void): () => void {
  // Forward navigation already wraps itself in the transition (in navigate()),
  // so the NAVIGATE event just commits. Back/forward (popstate) has no call
  // site to request one, so it reads the flag navigate() left in history.state:
  // animate iff this entry was reached by an animated navigation.
  const onPopState = () => {
    if (window.history.state?.[VIEW_TRANSITION_STATE_KEY]) {
      withViewTransition(callback);
    } else {
      callback();
    }
  };
  window.addEventListener(EVENTS.NAVIGATE, callback);
  window.addEventListener(EVENTS.POPSTATE, onPopState);
  return () => {
    window.removeEventListener(EVENTS.NAVIGATE, callback);
    window.removeEventListener(EVENTS.POPSTATE, onPopState);
  };
}

function getClientPathname(): string {
  return window.location.pathname;
}

// useLayoutEffect scrolls before the browser paints (no flash), but warns
// during SSR — fall back to useEffect on the server. Effects never run on the
// server anyway, so the scroll itself stays client-only either way.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Internal. Rendered by Router inside the matched route's content (so for lazy
 * routes it only mounts once Suspense resolves). Renders null. Scrolls to the
 * URL hash after the route commits, and on subsequent same-route hash changes.
 */
function ScrollToHash() {
  useIsomorphicLayoutEffect(() => {
    const scrollToHash = (behavior?: ScrollBehavior) => {
      const id = window.location.hash.slice(1);
      if (id)
        document
          .getElementById(id)
          ?.scrollIntoView(behavior ? { behavior } : undefined);
    };
    // On mount: the route just committed (eager, lazy-resolved, or a deep link
    // on first load). Scroll *instantly* — matching how the browser lands on a
    // fragment at page load (scroll-behavior:smooth doesn't apply there). It
    // also lands before a View Transition snapshots the page.
    scrollToHash("instant");
    // Same-route hash changes don't re-render Router (pathname is unchanged), so
    // listen for navigations and scroll to the new hash. No explicit behavior,
    // so the consumer's CSS `scroll-behavior` (e.g. smooth) is respected — just
    // like a native same-page anchor click.
    const onNavigate = () => scrollToHash();
    window.addEventListener(EVENTS.NAVIGATE, onNavigate);
    return () => window.removeEventListener(EVENTS.NAVIGATE, onNavigate);
  }, []);

  return null;
}

const resolveLazyComponent = (
  dynamicImport: DynamicImport,
): React.ComponentType => {
  const cached = lazyComponentsCache.get(dynamicImport);
  if (cached) return cached;

  // Reads the entry each render: render when resolved (no Suspense tick),
  // suspend while pending, throw to the error boundary if it failed.
  const LazyRoute: React.ComponentType = () => {
    const entry = lazyEntries.get(dynamicImport) ?? loadLazy(dynamicImport);
    if (entry.status === "resolved") {
      const Loaded = entry.Component;
      return <Loaded />;
    }
    throw entry.status === "rejected" ? entry.error : entry.promise;
  };
  LazyRoute.displayName = "LazyRoute";
  lazyComponentsCache.set(dynamicImport, LazyRoute);
  return LazyRoute;
};

export function Router({
  routes = [],
  loading = null,
  children,
  ssrPath,
  errorFallback,
  onError,
  scrollRestoration = false,
  scrollContainer,
}: RouterProps) {
  // React 18+ subscribes to the URL via useSyncExternalStore. Compared to the
  // older useState + useEffect pattern, this eliminates a race where a child
  // <Navigate /> in the initial tree fires its effect (mutating window.location)
  // *before* the parent Router's effect attaches its listener — the URL would
  // change but Router's state would not. useSyncExternalStore re-reads the
  // snapshot after every commit, so any such drift is caught automatically.
  const currentPath = useSyncExternalStore(
    subscribeToLocation,
    getClientPathname,
    () => ssrPath ?? "/",
  );

  // Bumped by the error boundary's reset() to force a fresh render (and a fresh
  // lazy import) after we've dropped the cached component.
  const [, forceRetry] = useReducer((n: number) => n + 1, 0);

  // Opt-in scroll restoration. install/teardown tracks positions + events;
  // the layout effect applies the queued scroll after the route commits (keyed
  // on pathname, so query-only navigations don't reset scroll). The container
  // ref is read lazily, so it resolves to the live element even if it mounts
  // after the Router.
  useEffect(() => {
    if (scrollRestoration)
      return installScrollRestoration(() => scrollContainer?.current ?? window);
  }, [scrollRestoration, scrollContainer]);
  useIsomorphicLayoutEffect(() => {
    if (scrollRestoration) applyPendingScroll();
  }, [scrollRestoration, currentPath]);

  // Memoized so a stable `routes` prop yields a stable list — keeping both
  // matchRoute's input and the preloadPath callback below stable, and avoiding
  // re-walking children every render. Recomputed only when routes/children change.
  const routesToUse = useMemo(() => {
    const childrenRoutes: RouteDefinition[] = [];
    Children.forEach(children, (child) => {
      const { props, type } = child as React.ReactElement;
      if (isRouteType(type)) {
        childrenRoutes.push(props as RouteDefinition);
      }
    });
    return routes.concat(childrenRoutes);
  }, [routes, children]);

  // Stable while routesToUse is stable, so Link's "render" preload effect (which
  // lists it as a dependency) doesn't re-schedule on every Router render.
  const preloadPath = useCallback(
    (to: string) => {
      const path = to.split(/[?#]/)[0]; // pathname only — drop any hash/query
      const { route } = matchRoute(routesToUse, path);
      if (route?.lazy) preloadRoute(route.lazy);
    },
    [routesToUse],
  );

  // Dev-only: a `routes` array recreated each render mints new lazy import thunks,
  // busting the lazy cache so those pages remount and lose state every render —
  // a silent flicker with no error. (Eager routes are fine: their component
  // reference is stable.) Warn once when an unstable array actually holds lazy
  // routes; the fix is to define it outside the component or wrap it in useMemo.
  const lastRoutes = useRef(routes);
  const warnedUnstableRoutes = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (
      routes !== lastRoutes.current &&
      !warnedUnstableRoutes.current &&
      routes.some((route) => route.lazy)
    ) {
      warnedUnstableRoutes.current = true;
      console.warn(
        "routini: the `routes` prop changed reference between renders and " +
          "includes lazy routes. Define the routes array outside your component " +
          "(or wrap it in useMemo) — otherwise lazy routes remount and lose " +
          "their state on every render.",
      );
    }
    lastRoutes.current = routes;
  }, [routes]);

  const { route: matchedRoute, params: routeParams } = matchRoute(
    routesToUse,
    currentPath,
  );

  if (process.env.NODE_ENV === "development") {
    if (matchedRoute?.lazy && matchedRoute?.component) {
      throw new Error(
        `Route "${matchedRoute.path}" has both lazy and component props. Use one or the other.`,
      );
    }
  }

  const Page = matchedRoute?.lazy
    ? resolveLazyComponent(matchedRoute.lazy)
    : matchedRoute?.component;

  if (process.env.NODE_ENV === "development" && !Page) {
    console.warn(
      `routini: No route matched "${currentPath}". Add a catch-all route with path="*".`,
    );
  }

  const pageContent = Page ? (
    <>
      <ScrollToHash key={currentPath} />
      <Page />
    </>
  ) : null;

  const routeContent = matchedRoute?.lazy ? (
    <Suspense fallback={matchedRoute?.loading ?? loading}>
      {pageContent}
    </Suspense>
  ) : (
    pageContent
  );

  // reset() drops the failed entry and re-renders; the cached wrapper re-reads
  // the cleared entry and re-runs the import.
  const resetRoute = () => {
    if (matchedRoute?.lazy) lazyEntries.delete(matchedRoute.lazy);
    forceRetry();
  };

  // The boundary wraps the matched page only. In the children/Outlet layout
  // pattern, `content` is what Outlet renders, so any layout components around
  // the Outlet sit *outside* this boundary — they stay alive when a page errors,
  // but a throw in that layout isn't caught here (that's the consumer's to guard
  // with their own boundary). Deliberate: see "Scope boundary" in the error
  // boundary architecture notes.
  const content = (
    <RouteErrorBoundary
      resetKey={currentPath}
      fallback={errorFallback}
      onError={onError}
      onReset={resetRoute}
    >
      {routeContent}
    </RouteErrorBoundary>
  );

  return (
    <RouterContext.Provider
      value={{ routeParams, currentPath, content, preloadPath }}
    >
      {children ?? content}
    </RouterContext.Provider>
  );
}

Router.displayName = "Router";
