// server/scripts/updateCardData.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cardDataProvider = require('../data/cardDataProvider');

// Source URLs for card data - change these as needed
const HEROES_URL = 'https://example.com/path/to/heroes.json';
const CARDS_URL = 'https://example.com/path/to/cards.json';

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    return null;
  }
}

async function updateData() {
  console.log('Starting card data update...');
  
  // Fetch heroes data
  console.log('Fetching heroes data...');
  const heroes = await fetchData(HEROES_URL);
  
  // Fetch cards data
  console.log('Fetching cards data...');
  const cards = await fetchData(CARDS_URL);
  
  if (heroes || cards) {
    // Process and transform data if needed
    // ...
    
    // Update the local files
    const result = cardDataProvider.updateCardData(heroes, cards);
    
    if (result) {
      console.log('Card data successfully updated!');
    } else {
      console.error('Failed to update card data.');
    }
  } else {
    console.error('No data was fetched. Update failed.');
  }
}

// Run the update
updateData().catch(console.error);