// server/controllers/heroController.js
const cardDataProvider = require('../data/cardDataProvider');

// Get all heroes
exports.getAllHeroes = async (req, res) => {
  try {
    const format = req.query.format;
    const heroes = format 
      ? cardDataProvider.getHeroesByFormat(format)
      : cardDataProvider.getAllHeroes();
    
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get specific hero by ID
exports.getHeroById = async (req, res) => {
  try {
    const hero = cardDataProvider.getHeroById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get specific hero by name
exports.getHeroByName = async (req, res) => {
  try {
    const hero = cardDataProvider.getHeroByName(req.params.name);
    
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};