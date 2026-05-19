import { match } from "path-to-regexp";
import type { RouteDefinition } from "../components/Router";

export interface MatchResult {
  route: RouteDefinition | undefined;
  params: Record<string, string>;
}

export function matchRoute(
  routes: RouteDefinition[],
  currentPath: string,
): MatchResult {
  let catchAll: RouteDefinition | undefined;

  for (const route of routes) {
    if (route.path === "*") {
      catchAll = route;
      continue;
    }
    if (route.path === currentPath) return { route, params: {} };
    const matchedUrl = match(route.path, { decode: decodeURIComponent });
    const matched = matchedUrl(currentPath);
    if (matched)
      return { route, params: matched.params as Record<string, string> };
  }

  if (catchAll) return { route: catchAll, params: {} };
  return { route: undefined, params: {} };
}
