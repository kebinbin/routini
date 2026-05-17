import { useContext } from "react";
import { RouterContext } from "../context/RouterContext";

export function useParams<
  T extends Record<string, string> = Record<string, string>,
>() {
  const { routeParams } = useContext(RouterContext);
  return routeParams as T;
}
