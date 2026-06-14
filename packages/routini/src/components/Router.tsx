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
  lazy,
  Suspense,
} from "react";
import { EVENTS } from "../consts";
import { RouterContext } from "../context/RouterContext";
import { matchRoute } from "../utils/matchRoute";
import { isRouteType } from "./Route";
import { RouteErrorBoundary, type ErrorFallback } from "./RouteErrorBoundary";
import { markChunkError } from "../utils/isChunkError";

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
}

const lazyComponentsCache = new WeakMap<
  DynamicImport,
  React.LazyExoticComponent<React.ComponentType>
>();

// Thunks whose chunk has already been preloaded — so repeated hovers (or a
// re-mounting "render" preload) fire the import at most once.
const preloadedThunks = new WeakSet<DynamicImport>();

/**
 * Speculatively warm a route's code-split chunk: call the import thunk so the
 * browser caches the module before navigation. Failures are swallowed (the real
 * navigation surfaces them through the error boundary) and the thunk is
 * forgotten so a later navigation can retry.
 */
function preloadRoute(dynamicImport: DynamicImport) {
  if (preloadedThunks.has(dynamicImport)) return;
  preloadedThunks.add(dynamicImport);
  dynamicImport().catch(() => preloadedThunks.delete(dynamicImport));
}

/**
 * Subscribe to URL changes. Module-level so its identity is stable across
 * renders (otherwise useSyncExternalStore would re-subscribe every render).
 */
function subscribeToLocation(callback: () => void): () => void {
  window.addEventListener(EVENTS.NAVIGATE, callback);
  window.addEventListener(EVENTS.POPSTATE, callback);
  return () => {
    window.removeEventListener(EVENTS.NAVIGATE, callback);
    window.removeEventListener(EVENTS.POPSTATE, callback);
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
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView();
    };
    // On mount: the route just committed (eager, lazy-resolved, or a deep link
    // on first load) — scroll if the URL carries a hash.
    scrollToHash();
    // Same-route hash changes don't re-render Router (pathname is unchanged),
    // so listen for navigations and scroll to the new hash directly.
    window.addEventListener(EVENTS.NAVIGATE, scrollToHash);
    return () => window.removeEventListener(EVENTS.NAVIGATE, scrollToHash);
  }, []);

  return null;
}

const resolveLazyComponent = (dynamicImport: DynamicImport) => {
  if (lazyComponentsCache.has(dynamicImport))
    return lazyComponentsCache.get(dynamicImport);

  const lazyComponent = lazy(() =>
    dynamicImport().then(
      (module) => {
        if (!module.default) {
          throw new Error(
            "Lazy route module must have a default export. Did you forget to add `export default`?",
          );
        }
        return module;
      },
      (cause) => {
        // The dynamic import() itself rejected — a genuine chunk-load failure.
        // Tag it so the error boundary recognises it without message-sniffing.
        // (Separate from the missing-default throw above, which is a dev bug.)
        throw markChunkError(cause);
      },
    ),
  );
  lazyComponentsCache.set(dynamicImport, lazyComponent);
  return lazyComponent;
};

export function Router({
  routes = [],
  loading = null,
  children,
  ssrPath,
  errorFallback,
  onError,
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

  // reset() from the error boundary drops the cached (poisoned) lazy component
  // for the current route and forces a re-render, so the retry mints a fresh
  // lazy() and re-runs the import.
  const resetRoute = () => {
    if (matchedRoute?.lazy) lazyComponentsCache.delete(matchedRoute.lazy);
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
