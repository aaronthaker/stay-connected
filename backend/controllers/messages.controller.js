const Message = require('../models/message');
const User = require('../models/user');

exports.getConversation = (req, res, next) => {
  const currentUserId = req.userData.userId;
  // ERROR IS HERE!
  // const otherUserId = req.params.otherUserId;
  const otherUserId = req.body.userIds[1];

  Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'email')
    .populate('receiverId', 'email')
    .then(messages => {
      res.status(200).json({
        message: 'Conversation retrieved successfully.',
        messages: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while retrieving the conversation.',
        error: error
      });
    });
};

exports.getUnreadMessages = (req, res, next) => {
  const receiverId = req.params.userId;

  Message.find({ receiverId, unread: true })
    .populate('senderId', 'name')
    .then(messages => {
      res.status(200).json({
        message: 'Unread messages fetched successfully!',
        messages: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching unread messages failed!'
      });
    });
};

exports.markMessageAsRead = (req, res, next) => {
  const messageId = req.params.messageId;

  Message.findByIdAndUpdate(messageId, { unread: false })
    .then(result => {
      if (result) {
        res.status(200).json({
          message: 'Message marked as read!'
        });
      } else {
        res.status(404).json({
          message: 'Message not found!'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Marking message as read failed!'
      });
    });
};

exports.sendMessage = (req, res, next) => {
  const message = new Message({
    senderId: req.userData.userId,
    receiverId: req.body.receiverId,
    content: req.body.content,
    timestamp: new Date()
  });

  message.save()
    .then(() => {
      res.status(201).json({
        message: 'Message sent successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
};