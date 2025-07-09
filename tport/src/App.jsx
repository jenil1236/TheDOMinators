
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "./components/NotFound";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
// import SmartParking from './pages/SmartParking';
// import CarPooling from './pages/CarPooling';
// import ShortestRoute from './pages/ShortestRoute';
// import BusBooking from './pages/BusBooking';
// import FutureTransport from './pages/FutureTransport';
import Footer from './components/Footer/Footer';
import ServiceAlerts from './components/ServiceAlerts/ServiceAlerts';
import ChatBot from './components/ChatBot/ChatBot';
import Combii from './components/Calculator/Combii';
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  console.log(user);
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
          setError("Failed to fetch user data");
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

          <Navbar user={user} setUser={setUser} />
          <ChatBot />
          <Routes>
            <Route path="/" element={<HomePage/>} />
          

       
        <Route path="/route-calculator" element={<Combii />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
            
            
            {/* <Route path="/smart-parking" element={<SmartParking />} />
            <Route path="/car-pooling" element={<CarPooling />} />
            <Route path="/route-calculator" element={<ShortestRoute />} />
            <Route path="/bus-info" element={<BusBooking />} />
            <Route path="/future-transport" element={<FutureTransport />} /> */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
    

  );
}



export default App;