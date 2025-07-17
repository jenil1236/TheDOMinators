import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { refreshAuth } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      console.log("Login successful", data);
      await refreshAuth(); // ✅ fetch current user from session
      navigate("/"); // redirect on login success
    } catch (err) {
      setError(err.message);
    }
  };

  const goToAdminLogin = () => {
    navigate("/admin/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f1f1f1;
        }

        .login-box {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-box h1 {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn {
          width: 100%;
          padding: 0.6rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn:hover {
          background-color: #0056b3;
        }

        .admin-link {
          margin-top: 1.5rem;
          text-align: center;
          cursor: pointer;
          color: #007bff;
          text-decoration: underline;
        }

        .register-link {
          margin-top: 1.5rem;
          text-align: center;
          cursor: pointer;
          color: #007bff;
          text-decoration: underline;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="login-box">
        <h1>Sign In</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn">Log In</button>
        </form>

        <div className="admin-link" onClick={goToAdminLogin}>
          If you are an admin — ADMIN LOGIN
        </div>

        <div className="register-link" onClick={goToRegister}>
          Don't have an account? — REGISTER
        </div>
      </div>
    </div>
  );
}

export default Login;
