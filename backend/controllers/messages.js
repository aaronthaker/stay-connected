const Message = require('../models/message');
const User = require('../models/user');

exports.getConversation = (req, res, next) => {
  const currentUserId = req.userData.userId;
  // ERROR IS HERE!
  // const otherUserId = req.params.otherUserId;
  const otherUserId = '6414c6f1cbf9978d29c0baf9';

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
