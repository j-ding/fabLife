// /server/utils/cardDataFetcher.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Card = require('../models/card');
const Hero = require('../models/hero');

// Base URLs for raw GitHub content
const BASE_URL = 'https://raw.githubusercontent.com/the-fab-cube/flesh-and-blood-cards/develop';
const JSON_URL = `${BASE_URL}/json/english`;

// Cache directory
const CACHE_DIR = path.join(__dirname, '../cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Function to fetch and cache JSON data
async function fetchAndCacheData(endpoint, filename) {
  const cachePath = path.join(CACHE_DIR, filename);
  
  try {
    // Check if cache exists and is less than 24 hours old
    if (fs.existsSync(cachePath)) {
      const stats = fs.statSync(cachePath);
      const cacheAge = Date.now() - stats.mtimeMs;
      
      // Use cache if less than 24 hours old
      if (cacheAge < 24 * 60 * 60 * 1000) {
        const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        return data;
      }
    }
    
    // Fetch fresh data
    const response = await axios.get(`${JSON_URL}/${endpoint}`);
    
    // Save to cache
    fs.writeFileSync(cachePath, JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    // If cache exists, use it as fallback even if old
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return data;
    }
    
    throw error;
  }
}

// Fetch cards data
async function fetchCards() {
  return fetchAndCacheData('cards.json', 'cards.json');
}

// Fetch hero data specifically
async function fetchHeroes() {
  const cards = await fetchCards();
  return cards.filter(card => 
    card.types && card.types.includes('Hero')
  );
}

// Import heroes to database
async function importHeroesToDB() {
  try {
    const heroes = await fetchHeroes();
    let importCount = 0;
    
    for (const hero of heroes) {
      // Check if this is a young hero
      const isYoung = hero.name.toLowerCase().includes('young') || 
                     hero.name.toLowerCase().includes('(y)');
      
      // Create or update hero
      await Hero.findOneAndUpdate(
        { name: hero.name },
        {
          card_id: hero.unique_id,
          name: hero.name,
          is_young: isYoung,
          base_health: isYoung ? 20 : 40, // Default health values
          image_url: hero.image_url || null,
          hero_class: hero.card_classes && hero.card_classes.length > 0 ? 
                    hero.card_classes[0] : 'Generic'
        },
        { upsert: true, new: true }
      );
      
      importCount++;
    }
    
    console.log(`Imported ${importCount} heroes successfully`);
    return importCount;
  } catch (error) {
    console.error('Error importing heroes:', error);
    throw error;
  }
}

// Import all cards to database
async function importCardsToDB() {
  try {
    const cards = await fetchCards();
    let importCount = 0;
    
    for (const card of cards) {
      // Process card data
      await Card.findOneAndUpdate(
        { unique_id: card.unique_id },
        {
          ...card,
          is_young_hero: card.types && 
                        card.types.includes('Hero') && 
                        (card.name.toLowerCase().includes('young') || 
                         card.name.toLowerCase().includes('(y)'))
        },
        { upsert: true, new: true }
      );
      
      importCount++;
    }
    
    console.log(`Imported ${importCount} cards successfully`);
    return importCount;
  } catch (error) {
    console.error('Error importing cards:', error);
    throw error;
  }
}

module.exports = {
  fetchCards,
  fetchHeroes,
  importHeroesToDB,
  importCardsToDB
};