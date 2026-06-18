import { useCallback, useMemo, useSyncExternalStore } from "react";
import { EVENTS } from "../consts";
import { navigate, type NavigateOptions } from "../utils/navigate";

type SearchParamsInit = string | Record<string, string> | URLSearchParams;

// useLocation/useParams just read RouterContext, because Router already tracks
// the path and puts it there. The location store ignores the query on purpose
// (so a query-only navigation doesn't remount the route), so this hook keeps
// its own subscription to the same nav events and reads window.location.search.
function subscribe(callback: () => void) {
  window.addEventListener(EVENTS.NAVIGATE, callback);
  window.addEventListener(EVENTS.POPSTATE, callback);
  return () => {
    window.removeEventListener(EVENTS.NAVIGATE, callback);
    window.removeEventListener(EVENTS.POPSTATE, callback);
  };
}

/** Read and update the URL's query string reactively. */
export function useSearchParams() {
  // Snapshot the raw string (a primitive, so it only "changes" when the query
  // really does); build the URLSearchParams in render.
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback(
    (init: SearchParamsInit, options?: NavigateOptions) => {
      const query = new URLSearchParams(init).toString();
      navigate(window.location.pathname + (query ? `?${query}` : ""), options);
    },
    [],
  );

  return [searchParams, setSearchParams] as const;
}
