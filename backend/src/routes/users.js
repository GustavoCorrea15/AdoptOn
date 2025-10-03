const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

// Rotas de usuários
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.update);
router.get('/:id', UserController.show);

module.exports = router;