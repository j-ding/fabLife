// /client/src/services/cardService.js
import axios from 'axios';

const API_URL = '/api';

export const getHeroes = async (format = null) => {
  try {
    const query = format ? `?format=${format}` : '';
    const response = await axios.get(`${API_URL}/heroes${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching heroes:', error);
    throw error;
  }
};

export const getHeroByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/heroes/name/${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hero ${name}:`, error);
    throw error;
  }
};

export const searchCards = async (searchParams) => {
  try {
    const response = await axios.get(`${API_URL}/cards/search`, { 
      params: searchParams 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching cards:', error);
    throw error;
  }
};

export const getCardById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching card ${id}:`, error);
    throw error;
  }
};

export const getCardsByClass = async (heroClass) => {
  try {
    const response = await axios.get(`${API_URL}/cards/class/${heroClass}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards for class ${heroClass}:`, error);
    throw error;
  }
};

export const getCardsByType = async (type) => {
  try {
    const response = await axios.get(`${API_URL}/cards/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards of type ${type}:`, error);
    throw error;
  }
};