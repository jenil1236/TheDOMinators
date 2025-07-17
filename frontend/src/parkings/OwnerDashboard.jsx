import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path as needed

function OwnerDashboard() {
  const { currentUser } = useAuth(); // assumes auth context provides user info
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  console.log(currentUser)
  useEffect(() => {
    fetch("http://localhost:3000/parkings/owner", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setOwner(data.owner))
      .catch((err) => console.error("Failed to load owner parkings", err));
  }, []);
  if (!owner) return <div>Loading...</div>;

  return (
    <div className="owner-dashboard">
      <style>{`
        .owner-dashboard {
          max-width: 800px;
          margin: auto;
          padding: 2rem;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        h2 {
          margin-top: 2rem;
          color: #2c3e50;
        }

        .info-section {
          background-color: #f9f9f9;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 2rem;
          box-shadow: 0 0 5px rgba(0,0,0,0.05);
        }

        .parking-card {
          background: #fff;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 1rem;
          box-shadow: 0 0 3px rgba(0,0,0,0.05);
        }

        .parking-card div {
          margin-bottom: 0.3rem;
        }

        .link-button {
          background-color: #007bff;
          color: white;
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.95rem;
          display: inline-block;
          margin-top: 0.5rem;
        }

        .link-button:hover {
          background-color: #0056b3;
        }

        .create-link {
          font-weight: bold;
          color: #28a745;
          cursor: pointer;
          display: inline-block;
          margin-top: 1rem;
        }

        .create-link:hover {
          text-decoration: underline;
        }

        hr {
          margin: 2rem 0;
        }
      `}</style>

      <h2>Owner Info</h2>
      <div className="info-section">
        <p><strong>Name:</strong> {currentUser.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Phone:</strong> {currentUser.phone}</p>
      </div>

      <h2>Your Parking Lots</h2>
      {owner.parkings.filter(p => p.owner === currentUser.id).length > 0 ? (
        owner.parkings
          .filter(parking => parking.owner === currentUser.id)
          .map(parking => (
            <div className="parking-card" key={parking._id}>
              <div><strong>Parking Name:</strong> {parking.name}</div>
              <div><strong>Location:</strong> {parking.location}</div>
              <div><strong>Rate per Hour:</strong> ₹{parking.rate}</div>
              <button
                className="link-button"
                onClick={() => navigate(`/parkings/owner/${parking._id}`)}
              >
                View Details
              </button>
            </div>
          ))
      ) : (
        <p>No parkings created yet.</p>
      )}

      <hr />

      <div>
        <span>Create Parking: </span>
        <span className="create-link" onClick={() => navigate("/parkings/owner/new")}>
          Click here
        </span>
      </div>
    </div>
  );
}

export default OwnerDashboard;
