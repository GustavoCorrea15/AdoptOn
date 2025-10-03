const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const auth = require('../middleware/auth');

// Rotas de chat
router.get('/conversations', auth, ChatController.getConversations);
router.get('/messages/:participantId/:animalId', auth, ChatController.getMessages);
router.post('/send', auth, ChatController.sendMessage);
router.put('/mark-read/:messageId', auth, ChatController.markAsRead);

module.exports = router;