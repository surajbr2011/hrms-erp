const express = require('express');
const router = express.Router();
const { getConversations, getMessages, createDirectConversation, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/conversations').get(protect, getConversations);
router.route('/direct').post(protect, createDirectConversation);
router.route('/:id/messages').get(protect, getMessages).post(protect, sendMessage);

module.exports = router;
