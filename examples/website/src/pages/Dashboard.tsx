import { Navigate } from "routini";
// redirects to /login if not authenticated
export default function Dashboard() {
  const isAuthenticated = false; // This should be determined by your auth logic
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <h1>Dashboard</h1>;
}
