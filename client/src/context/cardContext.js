import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const CardContext = createContext();

// Provider component
export const CardProvider = ({ children }) => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameFormat, setGameFormat] = useState(() => {
    // Try to get from localStorage, or default to 'blitz'
    return localStorage.getItem('defaultGameFormat') || 'blitz';
  });

  // Fetch heroes based on game format
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/heroes?format=${gameFormat}`);
        setHeroes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHeroes();
    
    // Save format preference to localStorage
    localStorage.setItem('defaultGameFormat', gameFormat);
  }, [gameFormat]);

  // Update game format
  const updateGameFormat = (format) => {
    setGameFormat(format);
  };

  return (
    <CardContext.Provider value={{ 
      heroes, 
      loading, 
      error, 
      gameFormat, 
      updateGameFormat 
    }}>
      {children}
    </CardContext.Provider>
  );
};