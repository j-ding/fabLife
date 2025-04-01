const Hero = require('../models/hero');

// Get all heroes
exports.getAllHeroes = async (req, res) => {
  try {
    // Filter based on young/adult if format specified
    const format = req.query.format;
    const query = {};
    
    if (format === 'blitz') {
      query.is_young = true;
    } else if (format === 'cc') {
      query.is_young = false;
    }
    
    const heroes = await Hero.find(query);
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get specific hero by ID
exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
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
    const hero = await Hero.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') } 
    });
    
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};