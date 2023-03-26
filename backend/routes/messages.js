const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const messagesController = require('../controllers/messages.controller');
const checkAuth = require('../middleware/check-auth');
const io = require('../socket');

// Retrieve a conversation between two users
router.get('/conversation/:otherUserId', checkAuth, messagesController.getConversation);
router.post('/conversation', checkAuth, messagesController.getConversation);

// Send a message to a user
router.post('/', checkAuth, (req, res, next) => {
  const message = new Message({
    senderId: req.userData.userId,
    receiverId: req.body.receiverId,
    content: req.body.content,
    timestamp: new Date()
  });

  message.save()
    .then(() => {
      io.emit('newMessage', message); // Emit a new message event
      res.status(201).json({
        message: 'Message sent successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});
// Fetch unread messages for a user
router.get('/unread/:userId', checkAuth, messagesController.getUnreadMessages);

// Mark a message as read
router.patch('/:messageId/read', checkAuth, messagesController.markMessageAsRead);

// Listen for incoming messages and emit them to the client using Socket.IO
Message.watch().on('change', (change) => {
  const message = change.fullDocument;
  io.getIO().emit('message', message);
});

module.exports = router;
