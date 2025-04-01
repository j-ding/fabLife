const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  unique_id: { 
    type: String, 
    required: true,
    unique: true
  },
  name: { 
    type: String, 
    required: true,
    index: true
  },
  pitch: { 
    type: Number,
    default: null
  },
  cost: {
    type: Number,
    default: null
  },
  power: {
    type: Number,
    default: null
  },
  defense: {
    type: Number,
    default: null
  },
  health: {
    type: Number,
    default: null
  },
  intelligence: {
    type: Number,
    default: null
  },
  rarity: {
    type: String,
    enum: ['C', 'R', 'S', 'M', 'L', 'F', 'T', 'P', null],
    default: null
  },
  types: [{
    type: String
  }],
  card_keywords: [{
    type: String
  }],
  card_abilities: [{
    type: String
  }],
  card_functional_text: {
    type: String,
    default: null
  },
  card_text: {
    type: String,
    default: null
  },
  flavor_text: {
    type: String,
    default: null
  },
  card_classes: [{
    type: String
  }],
  image_url: {
    type: String,
    default: null
  },
  is_young_hero: {
    type: Boolean,
    default: false
  },
  printings: [{
    set_id: String,
    collector_number: String,
    rarity: String,
    image_url: String
  }]
});

// Index for faster searches
CardSchema.index({ name: 'text', card_text: 'text' });

module.exports = mongoose.model('Card', mongoose.connection.useDb('fabcards').collection('cards'));