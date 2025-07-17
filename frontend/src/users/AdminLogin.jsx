import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path as needed

function AdminLogin() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const { isAdmin,setIsAdmin,refreshAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) throw new Error("Invalid master key");

      const data = await res.json();
      // console.log("Admin login success:", data);
      // setIsAdmin(true);
      // refreshAuth();
      await refreshAuth();
      navigate("/admin/dashboard"); // Go to admin dashboard
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #eee;
        }

        .admin-box {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        input {
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          padding: 0.6rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }

        .error {
          color: red;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>

      <div className="admin-box">
        <h2>Admin Login</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="key">Master Key:</label>
          <input
            type="text"
            id="key"
            name="key"
            placeholder="Enter master key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
