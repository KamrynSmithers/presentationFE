import { NavLink } from "react-router-dom";
import "../navbar.css";

function NavBar() {
  return (
    <nav className="main-nav">
      <div className="nav-logo">IMMEDIATELY</div>

      <div className="nav-links">
        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Books
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/music"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Music
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
