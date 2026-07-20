import { Navigate } from "routini";

// Renders nothing visible — <Navigate> redirects on mount. Replace-by-default
// (the redirect semantic) means Back won't return here and re-trigger it.
export default function RedirectMe() {
  return <Navigate to="/navigate" />;
}
