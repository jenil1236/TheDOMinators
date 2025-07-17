import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phone: "",
  });
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
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();
      console.log("Registered:", data);
      await refreshAuth(); // ✅ fetch current user from session
      navigate("/"); // Redirect after registration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-wrapper">
      <style>{`
        .register-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f8f8f8;
        }

        .register-box {
          background-color: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 450px;
        }

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn {
          width: 100%;
          padding: 0.6rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn:hover {
          background-color: #218838;
        }

        .link {
          text-align: center;
          margin-top: 1rem;
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="register-box">
        <h2>Create an Account</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="username">User Name:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              required
            />
          </div>

          <button type="submit" className="btn">Register</button>
        </form>

        <div className="link" onClick={() => navigate("/login")}>
          Already registered? Login here
        </div>

        <div className="link" onClick={() => navigate("/admin/login")}>
          If you are an admin — ADMIN LOGIN
        </div>
      </div>
    </div>
  );
}

export default Register;
