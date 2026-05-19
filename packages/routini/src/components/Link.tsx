import { navigate } from "../utils/navigate";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/**
 * A Link component that uses the navigate function to change the URL without reloading the page.
 */
export function Link({ target, to, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) return; // Ignore anything but primary clicks
    if (target !== undefined && target !== "_self") return; // Ignore 'target=_blank', etc.
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return; // Ignore clicks with modifier keys

    e.preventDefault();
    navigate(to);
  };

  return <a onClick={handleClick} href={to} target={target} {...props} />;
}

Link.displayName = "Link";
