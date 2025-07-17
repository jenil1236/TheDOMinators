import { useState, useEffect } from "react";

const AdminParkingUserDashboard = () => {
  const [parkingusers, setParkingUsers] = useState([]);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParkingUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/parkingusers", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch parking users");
        }

        setParkingUsers(data.parkingusers);
      } catch (err) {
        console.log(err)
        console.error(err.message);
      }
    };

    fetchParkingUsers();
  }, []);
  const onRemove = async (id) => {
    try {
      await fetch(`http://localhost:3000/admin/parkingusers/${id}`, {
        method: "DELETE",
        credentials: 'include'
      });
      // Refresh list or update state
      const response = await fetch("http://localhost:3000/admin/parkingusers", {
        credentials: "include",
      });
      const data = await response.json();
      setParkingUsers(data.parkingusers);
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <div>
      <h1>All Parking Users</h1>
      {parkingusers.map((parkinguser) => (
        <div key={parkinguser._id} style={{ marginBottom: "1rem" }}>
          <div>Name: {parkinguser.user.name}</div>
          <div>Email: {parkinguser.user.email}</div>
          <div>Phone: {parkinguser.user.phone}</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRemove(parkinguser._id);
            }}
          >
            <button type="submit">Remove User</button>
          </form>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default AdminParkingUserDashboard;
