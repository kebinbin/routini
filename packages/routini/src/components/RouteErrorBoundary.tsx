import { Component, type ErrorInfo, type ReactNode } from "react";
import { isChunkError } from "../utils/isChunkError";

export interface ErrorFallbackContext {
  /** The error thrown while loading or rendering the route. */
  error: Error;
  /**
   * Retry the route in place — re-attempts a failed lazy import and clears the
   * error, without a full page reload (app state is preserved). Best for a
   * transient render error or network blip.
   */
  reset: () => void;
  /**
   * Hard-reload the page (`location.reload()`). routini never calls this
   * itself — it's here so a custom fallback can offer it, e.g. for the
   * stale-deploy case where only a fresh document fixes the chunk URLs.
   */
  reload: () => void;
  /** True when the error is a failed code-split chunk download, not a render bug. */
  isChunkError: boolean;
}

/**
 * What to render when a route errors. A static node, or a function that
 * receives the error plus recovery helpers — mirrors TanStack Router's
 * `errorComponent({ error, reset })`.
 */
export type ErrorFallback =
  | ReactNode
  | ((ctx: ErrorFallbackContext) => ReactNode);

interface RouteErrorBoundaryProps {
  fallback?: ErrorFallback;
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Called by `reset()` so the parent can bust its lazy cache before retrying. */
  onReset?: () => void;
  /**
   * When this changes (Router passes the current path), a held error is
   * cleared — so navigating away from a broken route recovers automatically.
   * It clears the *error* without remounting the children, so same-route param
   * changes (e.g. /product/1 → /product/2) keep their state.
   */
  resetKey?: unknown;
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  error: Error | null;
  lastResetKey: unknown;
}

/**
 * Internal. Catches errors thrown below it — a failed lazy `import()` (which
 * Suspense itself does NOT catch, only suspension) or a render error in the
 * page — so one broken route never unmounts the whole app. Not exported;
 * configured through `<Router>`'s `errorFallback` / `onError` props.
 *
 * Must be a class: `getDerivedStateFromError` + `componentDidCatch` are the
 * only error-boundary hooks React exposes, and both are class-only.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  static displayName = "RouteErrorBoundary";

  state: RouteErrorBoundaryState = {
    error: null,
    lastResetKey: this.props.resetKey,
  };

  static getDerivedStateFromError(
    error: Error,
  ): Partial<RouteErrorBoundaryState> {
    return { error };
  }

  static getDerivedStateFromProps(
    props: RouteErrorBoundaryProps,
    state: RouteErrorBoundaryState,
  ): Partial<RouteErrorBoundaryState> | null {
    // resetKey (the current path) changed → drop any held error and remember
    // the new key. Clears the error on navigation without remounting children.
    if (props.resetKey !== state.lastResetKey) {
      return { error: null, lastResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    if (process.env.NODE_ENV === "development") {
      // Surface the real error in dev; React logs its own component trace too.
      console.error("routini: a route threw while rendering.\n", error);
    }
  }

  private reset = () => {
    // Let the parent (Router) drop the cached lazy component so the retry
    // re-runs the import, then clear our own error state.
    this.props.onReset?.();
    this.setState({ error: null });
  };

  private reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === "function") {
      return fallback({
        error,
        reset: this.reset,
        reload: this.reload,
        isChunkError: isChunkError(error),
      });
    }
    if (fallback !== undefined) return fallback;

    return <DefaultErrorFallback chunk={isChunkError(error)} />;
  }
}

/**
 * Minimal, design-neutral last resort. Honest copy: it never promises a fix
 * routini can't deliver. For anything branded, pass your own `errorFallback`.
 */
function DefaultErrorFallback({ chunk }: { chunk: boolean }) {
  return (
    <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
      {chunk ? "This page couldn’t be loaded." : "Something went wrong."}
    </div>
  );
}
