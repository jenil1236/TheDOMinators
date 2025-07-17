import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // assumes context is used

function LandingPage() {
  const { currentUser, isAdmin } = useAuth();
  const [allParkings, setAllParkings] = useState([]);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/parkings", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setAllParkings(data.allParkings))
      .catch(err => console.error("Failed to fetch parkings", err));
  }, []);

  useEffect(() => {
    if (!window.maptilersdk) return;

    window.maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    const map = new window.maptilersdk.Map({
      container: "cluster-map",
      style: window.maptilersdk.MapStyle.STREETS,
      center: [78.9629, 20.5937],
      zoom: 4.5,
    });

    allParkings.forEach(parking => {
      if (parking.geometry?.coordinates) {
        new window.maptilersdk.Marker()
          .setLngLat(parking.geometry.coordinates)
          .setPopup(new window.maptilersdk.Popup().setHTML(`<b>${parking.name}</b>`))
          .addTo(map);
      }
    });
  }, [allParkings]);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/parkings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOwner: role === "owner" }),
      });

      if (!res.ok) throw new Error("Role submission failed");

      if (role === "owner") navigate("/parkings/owner");
      else navigate("/parkings/user");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="landing-container">
      <style>{`
        .landing-container {
          max-width: 1000px;
          margin: auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
        }

        h2 {
          margin: 2rem 0 1rem;
          color: #2c3e50;
        }

        form {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 0 6px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
        }

        fieldset {
          border: none;
          margin-bottom: 1rem;
        }

        label {
          font-weight: 500;
          display: block;
          margin-bottom: 0.5rem;
        }

        .parking-card {
          background: #fff;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .parking-card div {
          margin-bottom: 0.4rem;
        }

        .button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .button:hover {
          background-color: #0056b3;
        }

        #cluster-map {
          width: 100%;
          height: 400px;
          margin-top: 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .logout-btn {
          background-color: #dc3545;
          margin-top: 1rem;
        }

        .logout-btn:hover {
          background-color: #b02a37;
        }
      `}</style>

      {currentUser ? (
        <>
          <form onSubmit={handleRoleSubmit}>
            <fieldset>
              <legend>Select Role:</legend>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                I want to book parking (User)
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={role === "owner"}
                  onChange={() => setRole("owner")}
                />
                I own a parking space (Owner)
              </label>
            </fieldset>

            <button type="submit" className="button">Submit</button>
          </form>

        </>
      ) : !isAdmin && (
        <p>To book or lend a parking lot, please log in first!</p>
      )}

      <h2>Our Parkings</h2>
      <div id="cluster-map"></div>

      {allParkings.map(parking => (
        <div className="parking-card" key={parking._id}>
          <div><strong>Parking Name:</strong> {parking.name}</div>
          <div><strong>Location:</strong> {parking.location}</div>
          <div><strong>Rate per Slot:</strong> ₹{parking.rate}</div>
          {isAdmin && (
            <button
              className="button"
              onClick={() => navigate(`/parkings/owner/${parking._id}`)}
            >
              Details
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default LandingPage;
