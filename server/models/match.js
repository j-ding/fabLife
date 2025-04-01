const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LifeChangeSchema = new Schema({
  player: {
    type: String,
    enum: ['player', 'opponent'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

const MatchSchema = new Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },
  format: {
    type: String,
    enum: ['blitz', 'cc'],
    default: 'blitz'
  },
  playerHero: {
    type: String,
    required: true
  },
  opponentHero: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  outcome: {
    type: String,
    enum: ['victory', 'defeat', 'draw', 'incomplete'],
    default: 'incomplete'
  },
  finalPlayerLife: {
    type: Number
  },
  finalOpponentLife: {
    type: Number
  },
  lifeHistory: [LifeChangeSchema]
});

module.exports = mongoose.model('Match', mongoose.connection.useDb('fabapp').collection('matches'));