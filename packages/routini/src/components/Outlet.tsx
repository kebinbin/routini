import { useContext } from "react";
import { RouterContext } from "../context/RouterContext";

export function Outlet() {
  const { content } = useContext(RouterContext);
  return <>{content}</>;
}
