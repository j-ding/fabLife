const Card = require('../models/Card');

// Get all cards with pagination
exports.getAllCards = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const cards = await Card.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const count = await Card.countDocuments();
    
    res.json({
      cards,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search cards
exports.searchCards = async (req, res) => {
  try {
    const { query, hero_class, type, page = 1, limit = 20 } = req.query;
    const searchQuery = {};
    
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    if (hero_class) {
      searchQuery.card_classes = hero_class;
    }
    
    if (type) {
      searchQuery.types = type;
    }
    
    const cards = await Card.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const count = await Card.countDocuments(searchQuery);
    
    res.json({
      cards,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findOne({ unique_id: req.params.id });
    
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};