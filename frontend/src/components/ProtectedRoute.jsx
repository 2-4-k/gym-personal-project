import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../useAuth";
import NavBar from "./NavBar";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell">
        <p className="status-text">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
