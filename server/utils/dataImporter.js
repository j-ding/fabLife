const axios = require('axios');
const Card = require('../models/Card');
const Hero = require('../models/hero');

// Base URL for raw GitHub content
const BASE_URL = 'https://raw.githubusercontent.com/the-fab-cube/flesh-and-blood-cards/main';

// Function to fetch JSON data from GitHub
async function fetchCardData() {
  try {
    // Fetch the English card data
    const response = await axios.get(`${BASE_URL}/json/english/cards.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error;
  }
}

// Function to import heroes specifically
async function importHeroes() {
  try {
    const cards = await fetchCardData();
    
    // Filter for hero cards only
    const heroes = cards.filter(card => 
      card.types && card.types.includes('Hero')
    );
    
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
    }
    
    console.log(`Imported ${heroes.length} heroes successfully`);
  } catch (error) {
    console.error('Error importing heroes:', error);
    throw error;
  }
}

// Function to import all cards
async function importAllCards() {
  try {
    const cards = await fetchCardData();
    
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
    }
    
    console.log(`Imported ${cards.length} cards successfully`);
  } catch (error) {
    console.error('Error importing cards:', error);
    throw error;
  }
}

module.exports = {
  fetchCardData,
  importHeroes,
  importAllCards
};