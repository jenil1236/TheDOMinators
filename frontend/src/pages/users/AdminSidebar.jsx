import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

const AdminSidebar = ({setUser,setIsAdmin,setToken}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', { withCredentials: true });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Optionally, show a message or handle failure
    }
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
    setToken(null);
    // useAuth.logout();
    navigate("/");
  };

  return (
    <>
      {/* Inline CSS for the layout */}
      <style>{`
        :root {
          --primary-color: #2c3e50;
          --secondary-color: #3498db;
          --sidebar-width: 60px;
          --sidebar-expanded-width: 220px;
          --transition-speed: 0.3s;
        }

        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
        }

        .sidebaro {
          width: var(--sidebar-width);
          height: 100vh;
          background-color: var(--primary-color);
          color: white;
          position: fixed;
          left:0px;
          transition: width var(--transition-speed) ease;
          overflow: hidden;
          z-index: 100;
        }

        .sidebaro:hover {
          width: var(--sidebar-expanded-width);
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.2s;
          color: white;
          text-decoration: none;
        }

        .menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .menu-item.active {
          background-color: var(--secondary-color);
        }

        .menu-icon {
          font-size: 20px;
          min-width: 24px;
          text-align: center;
        }

        .menu-text {
          margin-left: 12px;
          opacity: 0;
          transition: opacity var(--transition-speed);
        }

        .sidebaro:hover .menu-text {
          opacity: 1;
        }
      `}</style>

      {/* Layout */}
      <div className="admin-dashboard">
        <div className="sidebaro">

          <ul className="sidebar-menu">
            <li>
              <Link to="/admin/dashboard" className={(location.pathname == "/admin/dashboard" ? "active " : "") + "menu-item"}>
                <div className="menu-icon material-icons">dashboard</div>
                <span className="menu-text">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/admin/parkingusers" className={(location.pathname == "/admin/parkingusers" ? "active " : "") + "menu-item"}>
                <div className="menu-icon material-icons">people</div>
                <span className="menu-text">View Parking Users</span>
              </Link>
            </li>

            <li>
              <Link to="/admin/stops" className={(location.pathname == "/admin/stops" ? "active " : "") + "menu-item"}>
                <div className="menu-icon material-icons">directions</div>
                <span className="menu-text">View BRT Stops</span>
              </Link>
            </li>
            <li style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
              <div
                onClick={handleLogout}
                className="menu-item"
                style={{ cursor: 'pointer' }}
              >
                <div className="menu-icon material-icons"><Logout /></div>
                <span className="menu-text">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Link to Material Icons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </>
  );
};

export default AdminSidebar;
