// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
  const userId = req.query.userId;
  const recipientId = req.query.recipientId;

  Message.find({ $or: [ { senderId: userId, receiverId: recipientId }, { senderId: recipientId, receiverId: userId } ] })
    .sort({ timestamp: 1 })
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully',
        messages: messages
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', checkAuth, (req, res, next) => {
  const message = new Message({
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    content: req.body.content,
    timestamp: new Date()
  });

  message.save()
    .then(result => {
      res.status(201).json({
        message: 'Message sent',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
