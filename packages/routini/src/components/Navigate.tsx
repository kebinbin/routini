import { useEffect } from "react";
import { navigate } from "../utils/navigate";

export function Navigate({ to }: { to: string }) {
  useEffect(() => {
    navigate(to);
  }, [to]);
  return null;
}

Navigate.displayName = "Navigate";
