import { parse } from "regexparam";
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

    // regexparam compiles the pattern to a RegExp + ordered key names; we run
    // the match ourselves. Unlike path-to-regexp it doesn't decode, so each
    // captured segment is decodeURIComponent'd to preserve previous behavior.
    const { keys, pattern } = parse(route.path);
    const matched = pattern.exec(currentPath);
    if (matched) {
      const params: Record<string, string> = {};
      for (let i = 0; i < keys.length; i++) {
        const value = matched[i + 1];
        if (value !== undefined) params[keys[i]] = decodeURIComponent(value);
      }
      return { route, params };
    }
  }

  if (catchAll) return { route: catchAll, params: {} };
  return { route: undefined, params: {} };
}
