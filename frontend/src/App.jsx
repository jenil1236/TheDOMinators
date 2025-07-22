import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Box, CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";

// Auth Pages
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import AdminLogin from "./pages/users/AdminLogin";

// User Pages
import UserDashboard from "./pages/parkings/UserDashboard";
import BookParking from "./pages/parkings/BookParking";

// Owner Pages
import OwnerDashboard from "./pages/parkings/OwnerDashboard";
import NewParkingForm from "./pages/parkings/NewParkingForm";
import EditParkingForm from "./pages/parkings/EditParkingForm";
import ParkingDetails from "./pages/parkings/ParkingDetails";

// Role Selection
import LandingPage from "./pages/parkings/LandingPage";

// Admin
import AdminDashboard from "./pages/users/AdminDashboard";
import AdminParkingUserDashboard from "./pages/users/AdminParkingUserDashboard";

// 404 Page
import NotFound from "./NotFound";

import darkTheme from './utils/theme'; 

// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const { currentUser, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: darkTheme.palette.background.default
          }}
        >
          <CircularProgress color="primary" size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box
          component="main"
          sx={{
            minHeight: 'calc(100vh - 64px)',
            padding: { xs: '16px', md: '24px' },
            background: darkTheme.palette.background.default,
            color: darkTheme.palette.text.primary
          }}
        >
          <Routes>
            {/* Public */}
            <Route path="/parkings" element={<LandingPage />} />
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/parkings" />} />
            <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/parkings" />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />

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
            <Route path="/admin/parkingusers" element={isAdmin ? <AdminParkingUserDashboard /> : <Navigate to="/login"/> }/>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;