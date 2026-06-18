import type { RouteDefinition } from "../components/Router";

export interface MatchResult {
  route: RouteDefinition | undefined;
  params: Record<string, string>;
}

/**
 * Match `currentPath` against `routes`, in order. routini's matching surface is
 * intentionally tiny — static segments, `:param`, and a single `*` catch-all —
 * so it's matched by hand rather than pulling in a path-matching dependency
 * (keeping the library dependency-free). A trailing slash is tolerated
 * ("/about/" matches "/about"); `*` is only used when nothing specific matches,
 * wherever it sits in the array.
 */
export function matchRoute(
  routes: RouteDefinition[],
  currentPath: string,
): MatchResult {
  let catchAll: RouteDefinition | undefined;

  // Normalize one trailing slash (root "/" excepted) so "/about/" == "/about".
  const path =
    currentPath.length > 1 && currentPath.endsWith("/")
      ? currentPath.slice(0, -1)
      : currentPath;

  for (const route of routes) {
    if (route.path === "*") {
      catchAll = route;
      continue;
    }
    const params = matchPattern(route.path, path);
    if (params) return { route, params };
  }

  if (catchAll) return { route: catchAll, params: {} };
  return { route: undefined, params: {} };
}

/**
 * Returns the extracted params if `pattern` matches `path`, else null. A `:name`
 * segment captures that position (URL-decoded); every other segment must match
 * exactly. Segment counts must be equal, so "/a/b" never matches "/a".
 */
function matchPattern(
  pattern: string,
  path: string,
): Record<string, string> | null {
  if (pattern === path) return {}; // exact, no params — the common case

  const patternSegments = pattern.split("/");
  const pathSegments = path.split("/");
  if (patternSegments.length !== pathSegments.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const segment = patternSegments[i];
    if (segment[0] === ":") {
      const value = pathSegments[i];
      if (!value) return null; // an empty segment can't fill a :param
      params[segment.slice(1)] = decodeURIComponent(value);
    } else if (segment !== pathSegments[i]) {
      return null;
    }
  }
  return params;
}
