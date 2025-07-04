// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar/Navbar';
// import HomePage from './pages/HomePage';
// // import SmartParking from './pages/SmartParking';
// // import CarPooling from './pages/CarPooling';
// // import ShortestRoute from './pages/ShortestRoute';
// // import BusBooking from './pages/BusBooking';
// // import FutureTransport from './pages/FutureTransport';
// import Footer from './components/Footer/Footer';
// import ServiceAlerts from './components/ServiceAlerts/ServiceAlerts';
// import ChatBot from './components/ChatBot/ChatBot';
// import Hero from './components/Hero/Hero';
// import FAQ from './components/FAQ/FAQ';
// import FeatureBlock from './components/FeatureBlock/FeatureBlock';

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <ServiceAlerts />
//         <Navbar />
//         <ChatBot />
//         {/* <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/smart-parking" element={<SmartParking />} />
//           <Route path="/car-pooling" element={<CarPooling />} />
//           <Route path="/route-calculator" element={<ShortestRoute />} />
//           <Route path="/bus-info" element={<BusBooking />} />
//           <Route path="/future-transport" element={<FutureTransport />} />
//         </Routes> */}
        
//         <HomePage/>
        
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          
          <Navbar />
          <ChatBot />
          <Routes>
            <Route path="/" element={<HomePage />} />
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