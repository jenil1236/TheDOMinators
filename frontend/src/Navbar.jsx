import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        {currentUser && <Link to="/parkings/user" className="nav-link">User</Link>}
        {currentUser && <Link to="/parkings/owner" className="nav-link">Owner</Link>}
        {isAdmin && <Link to="/admin/dashboard" className="nav-link">Admin</Link>}
        {(!currentUser && !isAdmin) ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}
      </nav>

      <style>{`
        .navbar {
          background-color: #282c34;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
        }

        .nav-link:hover {
          text-decoration: underline;
        }

        .logout-btn {
          margin-left: auto;
          padding: 6px 12px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .logout-btn:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </>
  );
}

export default Navbar;
