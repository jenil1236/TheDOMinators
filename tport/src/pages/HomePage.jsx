import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import FeatureBlock from '../components/FeatureBlock/FeatureBlock';
import FAQ from '../components/FAQ/FAQ';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: "Smart Parking",
      description: "Find available parking spots in real-time across campus or city centers. Reserve your spot in advance and get directions directly to your parking space. Our AI-powered system predicts parking availability and guides you to the nearest open spot.",
      image: "src/assets/images/feature1.jpg",
    },
    {
      title: "Car Pooling",
      description: "Connect with fellow commuters heading in the same direction. Share rides to reduce traffic congestion and carbon footprint. Our matching algorithm finds the perfect ride partners based on your schedule and preferences.",
      image: "src/assets/images/feature2.jpg",
      reverse: true
    },
    {
      title: "Shortest Route + Fare Calculator",
      description: "Get optimized routes combining all transportation options with real-time fare calculations. Compare costs and travel times across different modes of transport. Our system factors in traffic, weather, and service disruptions.",
      image: "src/assets/images/feature3.jpg",
    },
    {
      title: "Bus Booking & Info",
      description: "Real-time bus tracking, schedules, and seat reservations all in one place. Get live updates on bus locations, estimated arrival times, and capacity. Book your seat in advance for stress-free commuting.",
      image: "src/assets/images/feature4.jpg",
      reverse: true
    },
    {
      title: "Future Transport",
      description: "Explore cutting-edge transportation innovations coming to your city. From hyperloop concepts to autonomous shuttles and aerial taxis, discover the future of urban mobility. Join pilot programs and experience tomorrow's transport today.",
      image: "src/assets/images/feature5.jpg",
    }
  ];

  return (
    <div className="home-page">
      <Hero />
      
      <div className="features-section">
        {features.map((feature, index) => (
          <FeatureBlock 
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            link={feature.link}
            reverse={feature.reverse}
          />
        ))}
      </div>
      
      <FAQ />
    </div>
  );
};

export default HomePage;