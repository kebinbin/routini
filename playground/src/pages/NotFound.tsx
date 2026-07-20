import { Link, useLocation } from "routini";

// Rendered by the `path: "*"` catch-all. Note it renders at the current URL —
// it does not redirect, so the address bar keeps the unmatched path.
export default function NotFound() {
  const { path } = useLocation();
  return (
    <>
      <h1 className="page-title">404 — no route matched</h1>
      <p className="page-intro">
        The catch-all <code>*</code> route rendered for <code>{path}</code>. The
        URL is unchanged — <code>*</code> renders in place, it doesn’t redirect
        (that’s <code>&lt;Navigate&gt;</code>’s job).
      </p>
      <Link className="btn" to="/">
        ← Home
      </Link>
    </>
  );
}
