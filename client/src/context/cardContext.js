import React, { createContext, useState, useEffect } from 'react';
import { getHeroes } from '../services/CardService';

export const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameFormat, setGameFormat] = useState('blitz'); // 'blitz' or 'cc'
  
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        const data = await getHeroes(gameFormat);
        setHeroes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchHeroes();
  }, [gameFormat]);
  
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