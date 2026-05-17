import { createContext } from "react";

export const RouterContext = createContext<{
  routeParams: Record<string, string>;
  currentPath: string;
  content: React.ReactNode;
}>({
  routeParams: {},
  currentPath: "/",
  content: null,
});
