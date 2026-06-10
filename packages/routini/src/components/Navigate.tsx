import { useEffect } from "react";
import { navigate } from "../utils/navigate";

interface NavigateProps {
  to: string;
  /**
   * Redirects replace the current history entry by default — otherwise the
   * back button returns to the route that redirected away, which immediately
   * redirects again (a back-button trap). Pass false to push a new entry.
   */
  replace?: boolean;
}

export function Navigate({ to, replace = true }: NavigateProps) {
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace]);
  return null;
}

Navigate.displayName = "Navigate";
