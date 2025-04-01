// server/data/cardDataProvider.js
const fs = require('fs');
const path = require('path');

// Path to card data files
const DATA_DIR = path.join(__dirname, 'card-files');
const HERO_FILE = path.join(DATA_DIR, 'heroes.json');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');

// Create directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default data in case files don't exist
const defaultHeroes = [
  { 
    name: 'Dorinthea (Young)',
    unique_id: 'dorinthea-young',
    is_young: true,
    base_health: 20,
    hero_class: 'Warrior',
    image_url: null
  },
  { 
    name: 'Dorinthea',
    unique_id: 'dorinthea',
    is_young: false,
    base_health: 40,
    hero_class: 'Warrior',
    image_url: null
  },
  // Add more default heroes as needed
];

// Function to get all heroes
function getAllHeroes() {
  try {
    if (fs.existsSync(HERO_FILE)) {
      const data = fs.readFileSync(HERO_FILE, 'utf8');
      return JSON.parse(data);
    } else {
      // Use default data if file doesn't exist
      return defaultHeroes;
    }
  } catch (error) {
    console.error('Error reading hero data:', error);
    return defaultHeroes;
  }
}

// Function to get filtered heroes by format
function getHeroesByFormat(format) {
  const heroes = getAllHeroes();
  
  if (format === 'blitz') {
    return heroes.filter(hero => hero.is_young);
  } else if (format === 'cc') {
    return heroes.filter(hero => !hero.is_young);
  }
  
  return heroes;
}

// Function to get a hero by ID
function getHeroById(id) {
  const heroes = getAllHeroes();
  return heroes.find(hero => hero.unique_id === id);
}

// Function to get a hero by name
function getHeroByName(name) {
  const heroes = getAllHeroes();
  const searchName = name.toLowerCase();
  return heroes.find(hero => hero.name.toLowerCase().includes(searchName));
}

// Function to update card data (for admin tools)
function updateCardData(newHeroes, newCards) {
  try {
    if (newHeroes) {
      fs.writeFileSync(HERO_FILE, JSON.stringify(newHeroes, null, 2));
    }
    
    if (newCards) {
      fs.writeFileSync(CARDS_FILE, JSON.stringify(newCards, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('Error updating card data:', error);
    return false;
  }
}

module.exports = {
  getAllHeroes,
  getHeroesByFormat,
  getHeroById,
  getHeroByName,
  updateCardData
};