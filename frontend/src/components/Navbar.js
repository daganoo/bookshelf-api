import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Book<span>Shelf</span>
      </div>
      <button className="btn btn-secondary btn-sm" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
