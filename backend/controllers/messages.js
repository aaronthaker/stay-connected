const Message = require('../models/message');
const User = require('../models/user');

exports.getConversation = (req, res, next) => {
  const currentUserId = req.userData.userId;
  const otherUserId = req.params.otherUserId;

  Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'email')
    .populate('receiverId', 'email')
    .exec((err, messages) => {
      if (err) {
        return res.status(500).json({
          message: 'An error occurred while retrieving the conversation.',
          error: err
        });
      }

      res.status(200).json({
        message: 'Conversation retrieved successfully.',
        messages: messages
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
