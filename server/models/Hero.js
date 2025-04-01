const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeroSchema = new Schema({
  card_id: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  is_young: {
    type: Boolean,
    default: false
  },
  base_health: {
    type: Number,
    required: true
  },
  image_url: {
    type: String
  },
  hero_class: {
    type: String
  }
});

module.exports = mongoose.model('Hero', mongoose.connection.useDb('fabapp').collection('heroes'));