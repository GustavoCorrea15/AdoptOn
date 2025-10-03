const express = require('express');
const router = express.Router();
const MatchingController = require('../controllers/MatchingController');
const auth = require('../middleware/auth');

// Rotas de matching
router.get('/compatible', auth, MatchingController.getCompatibleAnimals);
router.get('/compatibility/:animalId', auth, MatchingController.getCompatibilityDetails);

module.exports = router;