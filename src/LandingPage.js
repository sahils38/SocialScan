// LandingPage.js
import React, { useState, useEffect } from 'react';
import './landingpage.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/home');
  };

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 50;
      const maxScroll = 100;
      
      if (scrollPosition > threshold && scrollPosition < maxScroll) {
        const newOpacity = (scrollPosition - threshold) / (maxScroll - threshold);
        setOpacity(newOpacity);
      } else if (scrollPosition >= maxScroll) {
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div className="landingpage">
      <div className="imageContainer">
        <img className="landingImage" src="https://legal.thomsonreuters.com/blog/wp-content/uploads/sites/19/2022/05/AdobeStock_302733571-scaled.jpeg" alt="Landing" />
        <div className="textOverlay">
          <h1>Welcome to SocialScan</h1>
          <p>Your team's social media investigation tool.</p>
          <button 
            className="button1" 
            type="button" 
            style={{ opacity: opacity }} 
            onClick={handleClick}
          >
            Get Started
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default LandingPage;
