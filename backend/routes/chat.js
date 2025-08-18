const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all users for chat (admin only)
router.get('/users', authenticateToken, requireRole('admin'), chatController.getAllUsersForChat);

// Find or create a conversation (for users/mentors to initiate with admin)
router.post('/conversations/findOrCreate', authenticateToken, chatController.findOrCreateConversation);

// Admin find or create a conversation (for admin to initiate with user/mentor)
router.post('/admin/conversations/findOrCreate', authenticateToken, requireRole('admin'), chatController.adminFindOrCreateConversation);

// Send a message within a conversation
router.post('/messages/send', authenticateToken, chatController.sendMessage);

// Get messages for a specific conversation
router.get('/conversations/:id/messages', authenticateToken, chatController.getConversationMessages);

// Get all conversations for the current user (admin, user, or mentor)
router.get('/conversations', authenticateToken, chatController.getConversationsForUser);

module.exports = router;
