// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './LandingPage';
import Home from './Home';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait"> {/* Updated line */}
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 50 }} 
              transition={{ duration: 0.5 }}
            >
              <LandingPage />
            </motion.div>
          } 
        />
        <Route 
          path="/home" 
          element={
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }} 
              transition={{ duration: 0.5 }}
            >
              <Home />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
