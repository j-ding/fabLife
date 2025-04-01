const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const cardController = require('../controllers/cardController');

// Hero routes
router.get('/heroes', heroController.getAllHeroes);
router.get('/heroes/id/:id', heroController.getHeroById);
router.get('/heroes/name/:name', heroController.getHeroByName);

// Card routes
router.get('/cards', cardController.getAllCards);
router.get('/cards/search', cardController.searchCards);
router.get('/cards/:id', cardController.getCardById);

// Export routes
module.exports = router;

// Add these routes to your existing api.js file

// User routes
router.get('/user/settings', auth, userController.getUserSettings);
router.put('/user/settings', auth, userController.updateUserSettings);
router.put('/user/profile', auth, userController.updateUserProfile);
router.put('/user/password', auth, userController.changePassword);