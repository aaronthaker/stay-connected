const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const messagesController = require('../controllers/messages.controller');
const checkAuth = require('../middleware/check-auth');
const io = require('../socket');

// Retrieve a conversation between two users
router.get('/conversation/:otherUserId', checkAuth, messagesController.getConversation);

// Add this line to the list of routes
router.get('/contacts', checkAuth, messagesController.getContacts);

// Send a message to a user
router.post('/', checkAuth, messagesController.sendMessage);

// Fetch unread messages for a user
router.get('/unread/:userId', checkAuth, messagesController.getUnreadMessages);

// Mark a message as read
router.patch('/:messageId/read', checkAuth, messagesController.markMessageAsRead);

module.exports = router;
