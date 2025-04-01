const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const { importHeroes } = require('./utils/dataImporter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fab-life-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Import hero data if needed
    if (process.env.IMPORT_DATA === 'true') {
      importHeroes()
        .then(() => console.log('Hero data imported successfully'))
        .catch(err => console.error('Error importing hero data:', err));
    }
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

// API Routes
app.use('/api', apiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});