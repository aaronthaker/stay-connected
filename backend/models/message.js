const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  unread: { type: Boolean, required: true, default: true },
  timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Message', messageSchema);
