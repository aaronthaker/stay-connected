const express = require('express');
const router = express.Router();
const Message = require('../models/message'); // Import the Message model
const messagesController = require('../controllers/messages');
const checkAuth = require('../middleware/check-auth');

// Retrieve a conversation between two users
router.get('/conversation/:otherUserId', checkAuth, messagesController.getConversation);

// Send a message to a user
router.post('/', checkAuth, messagesController.sendMessage);

router.post('/conversation', checkAuth, (req, res, next) => {
  const userIds = req.body.userIds;
  Message.find({
    $or: [
      { sender: userIds[0], receiver: userIds[1] },
      { sender: userIds[1], receiver: userIds[0] }
    ]
  })
    .then(messages => {
      res.status(200).json({
        message: 'Successful',
        messages: messages
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
