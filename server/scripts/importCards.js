// /server/scripts/importCards.js
require('dotenv').config();
const mongoose = require('mongoose');
const { importCardsToDB, importHeroesToDB } = require('../utils/cardDataFetcher');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fab-life-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      console.log('Starting card import...');
      const cardCount = await importCardsToDB();
      console.log(`${cardCount} cards imported successfully.`);
      
      console.log('Starting hero import...');
      const heroCount = await importHeroesToDB();
      console.log(`${heroCount} heroes imported successfully.`);
      
      console.log('Import complete!');
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });