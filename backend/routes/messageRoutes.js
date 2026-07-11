const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  updateMessageStatus,
} = require('../controllers/messageController');

// POST /api/messages - Send a new message
router.post('/', sendMessage);

// GET /api/messages - Get chat history
router.get('/', getChatHistory);

// PATCH /api/messages/:messageId/status - Update message status
router.patch('/:messageId/status', updateMessageStatus);

module.exports = router;
