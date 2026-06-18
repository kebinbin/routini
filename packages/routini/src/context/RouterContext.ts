import { createContext } from "react";

export const RouterContext = createContext<{
  routeParams: Record<string, string>;
  currentPath: string;
  content: React.ReactNode;
  /**
   * Warm the code-split chunk for the route matching `to` (a no-op for eager
   * routes). Wired by Router and used by `<Link preload>`. Defaults to a no-op
   * so a `<Link>` rendered without a Router above it (tests, isolated stories)
   * keeps working — preload just does nothing, the chunk loads on click.
   */
  preloadPath: (to: string) => void;
}>({
  routeParams: {},
  currentPath: "/",
  content: null,
  preloadPath: () => {},
});
