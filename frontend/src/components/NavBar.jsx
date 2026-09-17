import { NavLink } from "react-router-dom";
import { useAuth } from "../useAuth";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Recovery
        </NavLink>
        <NavLink to="/log" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Log workout
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          History
        </NavLink>
        <NavLink to="/exercises" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Exercises
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Progress
        </NavLink>
      </div>
      <div className="nav-user">
        <ThemeToggle />
        <NavLink to="/account" className="nav-email">
          {user?.name || user?.email}
        </NavLink>
        <button className="nav-logout" onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
