const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['private', 'group'],
      required: true,
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    avatar: {
      type: String,
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

chatRoomSchema.index({ participants: 1, lastMessageTime: -1 });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
