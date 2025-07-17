import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f8f8f8;
          font-family: Arial, sans-serif;
        }

        h1 {
          margin-bottom: 2rem;
        }

        .btn {
          margin: 0.5rem;
          padding: 0.7rem 1.5rem;
          font-size: 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn:hover {
          background-color: #0056b3;
        }

        .logout {
          background-color: #dc3545;
        }

        .logout:hover {
          background-color: #b52a3b;
        }
      `}</style>

      <h1>Admin Dashboard</h1>
      <button className="btn" onClick={() => navigate("/parkings")}>
        View Parkings
      </button>

      <button className="btn" onClick={() => navigate("/admin/parkingusers")}>
        View Parking Users
      </button>

    </div>
  );
}

export default AdminDashboard;
