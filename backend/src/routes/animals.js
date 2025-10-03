const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/AnimalController');
const auth = require('../middleware/auth');

// Rotas de animais
router.get('/', AnimalController.index);
router.get('/:id', AnimalController.show);
router.post('/', auth, AnimalController.store);
router.get('/matching/compatible', auth, AnimalController.getMatching);

module.exports = router;