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
