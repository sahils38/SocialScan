// Home.js
import React from 'react';
import { motion } from 'framer-motion';
import './Home.css'
const Home = () => {
  return (
    <motion.div className='home-container'
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
    ><div className='image-container'>
      <img className='home-image' src='/img.webp' />
      </div>
    </motion.div>
  );
};

export default Home;
