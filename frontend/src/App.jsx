// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// Layout
// (Optional) You can create a Navbar and Footer if needed
import Navbar from "./Navbar";
// import Footer from "./components/Layout/Footer";

// Auth Pages
import Login from "./users/Login";
import Register from "./users/Register";
import AdminLogin from "./users/AdminLogin";

// User Pages
import UserDashboard from "./parkings/UserDashboard";
import BookParking from "./parkings/BookParking";

// Owner Pages
import OwnerDashboard from "./parkings/OwnerDashboard";
import NewParkingForm from "./parkings/NewParkingForm";
import EditParkingForm from "./parkings/EditParkingForm";
import ParkingDetails from "./parkings/ParkingDetails";

// Role Selection
import LandingPage from "./parkings/LandingPage";

// Admin
import AdminDashboard from "./users/AdminDashboard";
import AdminParkingUserDashboard from "./users/AdminParkingUserDashboard"
// 404 Page
const NotFound = () => <div style={{ padding: "2rem" }}>404 - Page Not Found</div>;

function App() {
  const { currentUser, isAdmin, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        {/* Optionally: <Route path="/admin/users" element={<ParkingUsers />} /> */}

        {/* User Flow */}
        <Route
          path="/parkings/user"
          element={currentUser ? <UserDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/parkings/user/:parkingId"
          element={currentUser ? <BookParking /> : <Navigate to="/login" />}
        />

        {/* Owner Flow */}
        <Route
          path="/parkings/owner"
          element={currentUser ? <OwnerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/parkings/owner/new"
          element={currentUser ? <NewParkingForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/parkings/owner/:parkingId"
          element={currentUser || isAdmin ? <ParkingDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/parkings/owner/:parkingId/edit"
          element={currentUser || isAdmin ? <EditParkingForm /> : <Navigate to="/login" />}
        />

        {/* Admin Flow */}
        <Route path="/parkings" element={<LandingPage />} />
        <Route path="/admin/parkingusers" element={<AdminParkingUserDashboard />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
