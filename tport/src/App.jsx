import React from "react";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer/Footer';
import ChatBot from './components/ChatBot/ChatBot';
import Combii from './components/Calculator/Combii';
import AuthPage from "./pages/AuthPage";
import PasswordRecovery from "./pages/PasswordRecovery";
import PostRidePage from "./pages/PostRidePage";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          {/* <Navbar user={user} setUser={setUser} /> */}
          <ChatBot />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/route-calculator" element={<Combii />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <AuthPage authType="login" setUser={setUser} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <AuthPage authType="register" setUser={setUser} />} 
            />
            <Route 
              path="/forgot-password" 
              element={user ? <Navigate to="/" /> : <PasswordRecovery setUser={setUser} />} 
            />
            <Route path="/post-ride" element={user ? <PostRidePage /> : <Navigate to="/login" />} />

          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;