import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path as needed

function ParkingDetails() {
  const { parkingId } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState(null);
  const {isAdmin}=useAuth();

  useEffect(() => {
    fetch(`http://localhost:3000/parkings/owner/${parkingId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setParking(data.parking))
      .catch((err) => console.error("Error fetching parking:", err));
  }, [parkingId]);

  useEffect(() => {
    if (!window.maptilersdk || !parking?.geometry?.coordinates) return;

    window.maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    const map = new window.maptilersdk.Map({
      container: "map",
      style: window.maptilersdk.MapStyle.STREETS,
      center: parking.geometry.coordinates,
      zoom: 14,
    });

    new window.maptilersdk.Marker()
      .setLngLat(parking.geometry.coordinates)
      .setPopup(new window.maptilersdk.Popup().setText(parking.name))
      .addTo(map);
  }, [parking]);

  const handleDeleteParking = async () => {
    if (!window.confirm("Are you sure you want to delete this parking?")) return;

    try {
      await fetch(`http://localhost:3000/parkings/owner/${parkingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      console.log(isAdmin);
      if(isAdmin)navigate("/parkings")
      else navigate("/parkings/owner");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete parking.");
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Remove this user from the parking?")) return;

    try {
      await fetch(`http://localhost:3000/parkings/owner/${parkingId}/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      window.location.reload();
    } catch (err) {
      console.error("Error removing user:", err);
      alert("Failed to remove user.");
    }
  };
  console.log(parking)
  if (!parking) return <div>Loading...</div>;

  return (
    <div className="parking-details-page">
      <style>{`
        .parking-details-page {
          max-width: 900px;
          margin: auto;
          padding: 2rem;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        #map {
          width: 100%;
          height: 400px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #ccc;
        }

        .info-block {
          background: #f7f7f7;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 0 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .info-block div {
          margin-bottom: 0.5rem;
        }

        .actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .button {
          padding: 0.6rem 1.2rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .button:hover {
          background-color: #0056b3;
        }

        .danger {
          background-color: #e74c3c;
        }

        .danger:hover {
          background-color: #c0392b;
        }

        .user-card {
          background: #fff;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .user-card div {
          margin-bottom: 0.3rem;
        }
      `}</style>

      <h2>Parking Lot Details</h2>
      <div className="info-block">
        <div id="map"></div>
        <div><strong>Parking Name:</strong> {parking.name}</div>
        <div><strong>Owner:</strong> {parking.owner.name}</div>
        <div><strong>Location:</strong> {parking.location}</div>
        <div><strong>Total Slots:</strong> {parking.totalSlots}</div>
        <div><strong>Available Slots:</strong> {parking.availableSlots}</div>
        <div><strong>Open Time:</strong> {parking.openTime}</div>
        <div><strong>Closing Time:</strong> {parking.closeTime}</div>
        <div><strong>Rate per Hour:</strong> ₹{parking.rate}</div>
      </div>

      <div className="actions">
        <button className="button" onClick={() => navigate(`/parkings/owner/${parking._id}/edit`)}>
          Update Parking
        </button>
        <button className="button danger" onClick={handleDeleteParking}>
          Delete Parking
        </button>
      </div>

      <h2>Users of this Parking Lot</h2>
      {parking.users.length > 0 ? (
        parking.users.map((userEntry) => (
          <div key={userEntry.user._id} className="user-card">
            <div><strong>Name:</strong> {userEntry.user.name}</div>
            <div><strong>Email:</strong> {userEntry.user.email}</div>
            <div><strong>Phone:</strong> {userEntry.user.phone}</div>
            <button
              className="button danger"
              onClick={() => handleRemoveUser(userEntry.user._id)}
            >
              Remove User
            </button>
          </div>
        ))
      ) : (
        <p>No users currently using this parking lot.</p>
      )}
    </div>
  );
}

export default ParkingDetails;
