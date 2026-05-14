/* eslint-disable react-hooks/static-components */
import { useEffect, useState, Children, lazy, Suspense } from "react";
import { match } from "path-to-regexp";
import { EVENTS } from "../consts";
import { RouterContext } from "../context/RouterContext";

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
}

const lazyComponentsCache = new WeakMap<
  DynamicImport,
  React.LazyExoticComponent<React.ComponentType>
>();

const resolveLazyComponent = (dynamicImport: DynamicImport) => {
  if (lazyComponentsCache.has(dynamicImport))
    return lazyComponentsCache.get(dynamicImport);

  const lazyComponent = lazy(() =>
    dynamicImport().then((module) => {
      if (!module.default) {
        throw new Error(
          "Lazy route module must have a default export. Did you forget to add `export default`?",
        );
      }
      return module;
    }),
  );
  lazyComponentsCache.set(dynamicImport, lazyComponent);
  return lazyComponent;
};

function matchRoute(routes: RouteDefinition[], currentPath: string) {
  let catchAll: RouteDefinition | undefined;

  for (const route of routes) {
    // Save * route as fallback, always try specific routes first
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

  // No specific route matched — use catch-all if defined
  if (catchAll) return { route: catchAll, params: {} };
  return { route: undefined, params: {} };
}

export function Router({ routes = [], loading = null, children }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener(EVENTS.PUSHSTATE, onLocationChange);
    window.addEventListener(EVENTS.POPSTATE, onLocationChange);
    return () => {
      window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange);
      window.removeEventListener(EVENTS.POPSTATE, onLocationChange);
    };
  }, []);

  const childrenRoutes: RouteDefinition[] = [];
  Children.forEach(children, (child) => {
    const { props, type } = child as React.ReactElement;
    const { name } = type as { name: string };
    if (name === "Route") {
      childrenRoutes.push(props as RouteDefinition);
    }
  });

  const routesToUse = routes.concat(childrenRoutes);

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

  const pageContent = Page ? <Page /> : null;

  const content = matchedRoute?.lazy ? (
    <Suspense fallback={matchedRoute?.loading ?? loading}>
      {pageContent}
    </Suspense>
  ) : (
    pageContent
  );

  return (
    <RouterContext.Provider value={{ routeParams, currentPath, content }}>
      {children ?? content}
    </RouterContext.Provider>
  );
}
