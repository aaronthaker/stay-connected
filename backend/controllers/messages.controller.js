const Message = require('../models/message');
const User = require('../models/user');
const io = require('../socket');

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

exports.getContacts = (req, res, next) => {
  const currentUserId = req.userData.userId;

  Message.find({
    $or: [
      { senderId: currentUserId },
      { receiverId: currentUserId }
    ]
  })
    .populate('senderId', 'email')
    .populate('receiverId', 'email')
    .then(messages => {
      const contacts = [];
      messages.forEach(message => {
        if (message.senderId._id.toString() === currentUserId) {
          if (!contacts.some(contact => contact._id.toString() === message.receiverId._id.toString())) {
            contacts.push(message.receiverId);
          }
        } else {
          if (!contacts.some(contact => contact._id.toString() === message.senderId._id.toString())) {
            contacts.push(message.senderId);
          }
        }
      });

      res.status(200).json({
        message: 'Contacts retrieved successfully.',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while retrieving contacts.',
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
    timestamp: new Date(),
    unread: true // set unread to true by default for new messages
  });

  message.save()
    .then(() => {
      // Emit a newMessage event to the Socket.IO server
      io.getIO().emit('newMessage', { message: message });
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
