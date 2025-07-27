import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminParkingUserDashboard from "./AdminParkingUserDashboard";
import AdminBusStopMarkers from "../../components/admin/BusStopMarkers/AdminBusStopMarkers";
import NotFound from "../../NotFound";
import { Routes, Route, Navigate } from "react-router-dom";

const AdminPage = ({ isAdmin,setUser,setIsAdmin,setToken }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar setUser={setUser} setIsAdmin={setIsAdmin} setToken={setToken} />

      {/* Main content area */}
      <div className="main-content" style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route
            path="dashboard"
            element={isAdmin ? <AdminDashboard /> : <NotFound />}
          />
          <Route
            path="parkingusers"
            element={isAdmin ? <AdminParkingUserDashboard /> : <NotFound />}
          />
          <Route
            path="stops"
            element={isAdmin ? <AdminBusStopMarkers /> : <NotFound />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
