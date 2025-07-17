import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewParkingForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSlots: 1,
    availableSlots: 1,
    rate: 0,
    openTime: "",
    closeTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    // Sync availableSlots to totalSlots if totalSlots is changed
    if (name === "totalSlots") {
      newForm.availableSlots = value;
    }

    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/parkings/owner/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create parking.");
      
      navigate("/parkings/owner");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="new-parking-container">
      <style>{`
        .new-parking-container {
          max-width: 600px;
          margin: auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          color: #333;
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
          display: block;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }

        .cancel-link {
          color: #dc3545;
          font-weight: bold;
          text-decoration: none;
        }

        .cancel-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <h2>Add a New Parking Lot</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Parking Name</label>
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
          <label htmlFor="location">Address / Location</label>
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
          <label htmlFor="totalSlots">Total Slots</label>
          <input
            type="number"
            id="totalSlots"
            name="totalSlots"
            value={form.totalSlots}
            min="1"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="availableSlots">Available Slots (now)</label>
          <input
            type="number"
            id="availableSlots"
            name="availableSlots"
            value={form.availableSlots}
            min="0"
            max={form.totalSlots}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="rate">Rate (₹ / Slot)</label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={form.rate}
            min="0"
            step="0.01"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="openTime">Opening Time</label>
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
          <label htmlFor="closeTime">Closing Time</label>
          <input
            type="time"
            id="closeTime"
            name="closeTime"
            value={form.closeTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Create Parking</button>
          <a href="/parkings/owner" className="cancel-link">Cancel</a>
        </div>
      </form>
    </div>
  );
}

export default NewParkingForm;
