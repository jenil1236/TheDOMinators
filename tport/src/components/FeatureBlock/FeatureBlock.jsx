import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './FeatureBlock.css';

const FeatureBlock = ({ title, description, image, reverse }) => {
  return (
    <motion.div 
      className={`feature-block ${reverse ? 'reverse' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="feature-content">
        <motion.h2 
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          
        </motion.div>
      </div>
      
      <motion.div 
        className="feature-image-container"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="feature-image" style={{ backgroundImage: `url(${image})` }} />
        <div className="image-overlay" />
      </motion.div>
    </motion.div>
  );
};

export default FeatureBlock;