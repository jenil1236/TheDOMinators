import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BookParking() {
  const { parkingId } = useParams();
  const navigate = useNavigate();

  const [parking, setParking] = useState(null);
  const [vehicle, setVehicle] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch parking details
    fetch(`http://localhost:3000/parkings/user/${parkingId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setParking(data.parking))
      .catch((err) => console.error("Error loading parking:", err));
  }, [parkingId]);

  useEffect(() => {
    if (!parking || !window.maptilersdk || !parking.geometry) return;

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

  const handleVehicleChange = (e) => {
    const v = e.target.value;
    setVehicle(v);

    const rate = parking.rate;
    const multiplier = v === "car" ? 4 : v === "auto" ? 3 : 2;
    setPrice(rate * multiplier);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/parkings/user/${parkingId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle }),
      });

      if (!res.ok) throw new Error("Booking failed");

      navigate("/parkings/user");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!parking) return <div>Loading parking details...</div>;

  return (
    <div className="book-page">
      <style>{`
        .book-page {
          max-width: 800px;
          margin: auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
        }

        h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        #map {
          width: 100%;
          height: 400px;
          margin-bottom: 2rem;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .section {
          margin-bottom: 2rem;
        }

        .label {
          font-weight: bold;
        }

        .info-block {
          background: #f9f9f9;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        select {
          padding: 0.5rem;
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

        .money {
          font-weight: bold;
        }
      `}</style>

      <h2>Parking Lot Details</h2>
      <div className="section info-block">
        <div id="map"></div>
        <div><span className="label">Parking Name:</span> {parking.name}</div>
        <div><span className="label">Location:</span> {parking.location}</div>
        <div><span className="label">Total Slots:</span> {parking.totalSlots}</div>
        <div><span className="label">Available Slots:</span> {parking.availableSlots}</div>
        <div><span className="label">Open Time:</span> {parking.openTime}</div>
        <div><span className="label">Closing Time:</span> {parking.closeTime}</div>
        <div><span className="label">Rate per Hour:</span> ₹{parking.rate}</div>
      </div>

      <h2>Contact Owner</h2>
      <div className="section info-block">
        <div><span className="label">Name:</span> {parking.owner.name}</div>
        <div><span className="label">Phone:</span> {parking.owner.phone}</div>
        <div><span className="label">Email:</span> {parking.owner.email}</div>
      </div>

      <h2>Booking</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="vehicle" className="label">Vehicle Type</label>
        <select id="vehicle" name="vehicle" required onChange={handleVehicleChange} value={vehicle}>
          <option value="" disabled>Select One</option>
          <option value="bike">Bike</option>
          <option value="auto">Auto</option>
          <option value="car">Car</option>
        </select>

        <div>
          Money to be paid: ₹<span className="money">{price.toFixed(2)}</span>
        </div>

        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}

export default BookParking;
