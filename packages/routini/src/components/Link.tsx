import { navigate } from "../utils/navigate";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  /**
   * Animate this navigation with the View Transitions API. Ignored (instant
   * navigation) in browsers without `document.startViewTransition`.
   */
  viewTransition?: boolean;
}

export function Link({
  target,
  to,
  replace,
  viewTransition,
  ...props
}: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) return;
    if (target !== undefined && target !== "_self") return;
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    // Pure hash link (e.g. to="#section"): let the browser scroll natively.
    if (to.startsWith("#")) return;

    // Path links navigate in-app. Any #hash stays in the URL so Router's
    // ScrollToHash can scroll to it once the matched route has committed.
    e.preventDefault();
    navigate(to, { replace, viewTransition });
  };

  return <a onClick={handleClick} href={to} target={target} {...props} />;
}

Link.displayName = "Link";
