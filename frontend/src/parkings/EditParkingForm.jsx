import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditParkingForm() {
  const { parkingId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSlots: 1,
    availableSlots: 1,
    openTime: "",
    closeTime: "",
    rate: 0,
  });

  const [diff, setDiff] = useState(0);

  useEffect(() => {
    // Fetch existing parking details
    fetch(`http://localhost:3000/parkings/owner/${parkingId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const p = data.parking;
        setForm({
          name: p.name,
          location: p.location,
          totalSlots: p.totalSlots,
          availableSlots: p.availableSlots,
          openTime: p.openTime,
          closeTime: p.closeTime,
          rate: p.rate,
        });
        setDiff(p.totalSlots - p.availableSlots);
      })
      .catch((err) => console.error("Error loading parking:", err));
  }, [parkingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (name === "totalSlots") {
      const newTotal = parseInt(value);
      updated.availableSlots = Math.max(0, newTotal - diff);
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/parkings/owner/${parkingId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update parking");

      navigate(`/parkings/owner/${parkingId}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="edit-parking-container">
      <style>{`
        .edit-parking-container {
          max-width: 600px;
          margin: auto;
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        label {
          font-weight: 500;
          margin-bottom: 0.2rem;
        }

        input {
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 1rem;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>

      <h2>Edit Parking Lot</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Parking Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="totalSlots">Total Slots:</label>
          <input
            type="number"
            id="totalSlots"
            name="totalSlots"
            value={form.totalSlots}
            min={diff}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="availableSlots">Available Slots:</label>
          <input
            type="number"
            id="availableSlots"
            name="availableSlots"
            value={form.availableSlots}
            max={form.totalSlots - diff}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="openTime">Open Time:</label>
          <input
            type="time"
            id="openTime"
            name="openTime"
            value={form.openTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="closeTime">Close Time:</label>
          <input
            type="time"
            id="closeTime"
            name="closeTime"
            value={form.closeTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="rate">Rate per Slot (₹):</label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Update Parking</button>
      </form>
    </div>
  );
}

export default EditParkingForm;
