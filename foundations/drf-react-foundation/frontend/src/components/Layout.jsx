import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.js";

export default function Layout() {
  const { user, status, logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand">Foundation</Link>
        <nav className="row">
          {status === "signed-in" ? (
            <>
              <NavLink to="/notes">Notes</NavLink>
              <span className="muted">{user.display_name || user.email}</span>
              <button className="ghost" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
