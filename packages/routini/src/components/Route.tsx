interface RouteProps {
  path: string;
  component?: React.ComponentType;
  lazy?: () => Promise<{ default: React.ComponentType }>;
  loading?: React.ReactNode;
}

/**
 * A Route component that renders a specific component based on the current URL path.
 */
export function Route(_props: RouteProps) {
  return null;
}

const ROUTE_MARKER = Symbol.for("routini.Route");

Route.displayName = "Route";
(Route as { $$marker?: symbol }).$$marker = ROUTE_MARKER;

export const isRouteType = (type: unknown): type is typeof Route =>
  typeof type === "function" &&
  (type as { $$marker?: symbol }).$$marker === ROUTE_MARKER;
