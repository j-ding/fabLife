// /client/src/context/CardContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getHeroes, getCardById, searchCards } from '../services/cardService';

export const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [heroes, setHeroes] = useState([]);
  const [recentCards, setRecentCards] = useState([]);
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
        const data = await getHeroes(gameFormat);
        setHeroes(data);
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
  
  // Get a card by ID and add to recent cards
  const fetchCardById = useCallback(async (id) => {
    try {
      setLoading(true);
      const cardData = await getCardById(id);
      
      // Add to recent cards if not already there
      setRecentCards(prev => {
        const exists = prev.some(card => card.unique_id === cardData.unique_id);
        if (!exists) {
          // Keep only the last 10 cards
          const newRecent = [cardData, ...prev].slice(0, 10);
          // Save to localStorage
          localStorage.setItem('recentCards', JSON.stringify(newRecent));
          return newRecent;
        }
        return prev;
      });
      
      setLoading(false);
      return cardData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);
  
  // Load recent cards from localStorage on initial render
  useEffect(() => {
    const storedCards = localStorage.getItem('recentCards');
    if (storedCards) {
      try {
        setRecentCards(JSON.parse(storedCards));
      } catch (e) {
        console.error('Failed to parse stored cards:', e);
        localStorage.removeItem('recentCards');
      }
    }
  }, []);
  
  // Search for cards
  const searchForCards = useCallback(async (params) => {
    try {
      setLoading(true);
      const results = await searchCards(params);
      setLoading(false);
      return results;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);
  
  return (
    <CardContext.Provider value={{ 
      heroes, 
      recentCards,
      loading, 
      error, 
      gameFormat, 
      updateGameFormat,
      fetchCardById,
      searchForCards
    }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => React.useContext(CardContext);