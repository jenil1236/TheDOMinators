import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Smart Parking', path: '/smart-parking' },
    { name: 'Car Pooling', path: '/car-pooling' },
    { name: 'Route + Fare', path: '/route-calculator' },
    { name: 'Bus Booking', path: '/bus-info' },
    { name: 'Future Transport', path: '/future-transport' },
  ];

  return (
    
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="navbar-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" onClick={() => setActiveTab('')}>
            <span className="logo-text">Transit</span>
            <span className="logo-highlight">Flow</span>
          </Link>
        </motion.div>
        
        <div className="nav-links">
          {navLinks.map((link, index) => (
  <motion.div
    key={link.name}
    className={`nav-item ${activeTab === link.name ? 'active' : ''}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      to={link.path} 
      onClick={() => setActiveTab(link.name)}
    >
      {link.name}
      <span className="underline" />
    </Link>
  </motion.div>
))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;