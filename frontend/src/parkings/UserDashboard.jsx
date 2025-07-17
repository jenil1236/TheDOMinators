import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust as needed
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [allParkings, setAllParkings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/parkings/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data.user);
        setAllParkings(data.allParkings);
      })
      .catch((err) => console.error("Failed to load user data:", err));
  }, []);

useEffect(() => {
  if (!window.maptilersdk) return;
  
    window.maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

  setTimeout(() => {
    const map = new window.maptilersdk.Map({
      container: "cluster-map",
      style: window.maptilersdk.MapStyle.STREETS,
      center: [78.9629, 20.5937],
      zoom: 4.5,
    });

    allParkings.forEach((parking) => {
      if (parking.geometry?.coordinates) {
        new window.maptilersdk.Marker()
          .setLngLat(parking.geometry.coordinates)
          .setPopup(new window.maptilersdk.Popup().setText(parking.name))
          .addTo(map);
      }
    });
  }, 100); // small delay
}, [allParkings]);

  const handleLeaveParking = async (parkingId) => {
    if (!window.confirm("Are you sure you want to leave this parking?")) return;

    try {
      await fetch(`http://localhost:3000/parkings/user/${parkingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      window.location.reload();
    } catch (err) {
      console.error("Leave parking error:", err);
    }
  };

  const handleBook = (parkingId) => {
    navigate(`/parkings/user/${parkingId}`);
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="user-dashboard">
      <style>{`
        .user-dashboard {
          max-width: 1000px;
          margin: auto;
          padding: 2rem;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        h2 {
          color: #2c3e50;
          margin-top: 2rem;
        }

        .info-box {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 0 5px rgba(0,0,0,0.05);
        }

        .parking-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 0 4px rgba(0,0,0,0.05);
        }

        .parking-card div {
          margin-bottom: 0.4rem;
        }

        .button {
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        .button:hover {
          background-color: #0056b3;
        }

        .leave-button {
          background-color: #dc3545;
        }

        .leave-button:hover {
          background-color: #b02a37;
        }

        #cluster-map {
          width: 100%;
          height: 400px;
          border-radius: 8px;
          margin: 1rem 0 2rem;
          border: 1px solid #ccc;
        }
      `}</style>

      <h2>User Info</h2>
      <div className="info-box">
        <p><strong>Name:</strong> {currentUser.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Phone:</strong> {currentUser.phone}</p>
      </div>

      <h2>Booked Parking Lots</h2>
      {userData.parkings.filter(p => p.owner !== currentUser.id).length ? (
        userData.parkings
          .filter(p => p.owner !== currentUser.id)
          .map((parking) => (
            <div key={parking._id} className="parking-card">
              <div><strong>Parking Name:</strong> {parking.name}</div>
              <div><strong>Location:</strong> {parking.location}</div>
              <div><strong>Rate per Slot:</strong> ₹{parking.rate}</div>
              <button
                className="button leave-button"
                onClick={() => handleLeaveParking(parking._id)}
              >
                Leave Parking
              </button>
            </div>
          ))
      ) : (
        <p>No active bookings.</p>
      )}

      <h2>Available Parking Lots</h2>
      <div id="cluster-map"></div>

      {allParkings.filter(p => p.owner !== currentUser.id).length ? (
        allParkings
          .filter(p => p.owner !== currentUser.id)
          .map((parking) => (
            <div key={parking._id} className="parking-card">
              <div><strong>Parking Name:</strong> {parking.name}</div>
              <div><strong>Location:</strong> {parking.location}</div>
              <div><strong>Rate per Hour:</strong> ₹{parking.rate}</div>
              <button className="button" onClick={() => handleBook(parking._id)}>
                Book
              </button>
            </div>
          ))
      ) : (
        <p>No available parkings found.</p>
      )}
    </div>
  );
}

export default UserDashboard;
