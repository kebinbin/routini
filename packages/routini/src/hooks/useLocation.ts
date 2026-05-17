import { useContext } from "react";
import { RouterContext } from "../context/RouterContext";
import { navigate } from "../utils/navigate";

export function useLocation() {
  const { currentPath } = useContext(RouterContext);
  return { path: currentPath, navigate };
}
