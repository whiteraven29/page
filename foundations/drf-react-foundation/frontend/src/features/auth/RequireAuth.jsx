import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.js";

export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <p className="muted">Loading…</p>;
  if (status === "signed-out") return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
