const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { requireRole } = require('../middleware');

router.post('/conversations', chatController.createConversation);
router.post('/messages', chatController.sendMessage);
router.get('/conversations/:conversation_id/messages', chatController.getConversationMessages);
router.get('/users/:user_id/conversations', chatController.getUserConversations);

module.exports = router;
