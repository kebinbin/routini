import { Link } from "../routini/components/Link";
import { useLocation } from "../routini/hooks/useLocation";

export default function Nav() {
  const { path } = useLocation();
  console.log("Current path:", path); // Debugging log to check the current path
  return (
    <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <Link
        to="/"
        style={path === "/" ? { fontWeight: "bold", color: "red" } : {}}
      >
        Home
      </Link>
      <Link
        to="/en/about"
        style={path === "/en/about" ? { fontWeight: "bold", color: "red" } : {}}
      >
        About
      </Link>
      <Link
        to="/dashboard"
        style={
          path === "/dashboard" ? { fontWeight: "bold", color: "red" } : {}
        }
      >
        Dashboard
      </Link>
      <Link
        to="/login"
        style={path === "/login" ? { fontWeight: "bold", color: "red" } : {}}
      >
        Login
      </Link>
    </nav>
  );
}
