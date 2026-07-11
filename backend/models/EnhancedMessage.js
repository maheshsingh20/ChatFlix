const mongoose = require('mongoose');

const enhancedMessageSchema = new mongoose.Schema(
  {
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EnhancedUser',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnhancedUser',
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
    deliveredTo: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnhancedUser',
      },
      deliveredAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
enhancedMessageSchema.index({ chatRoom: 1, timestamp: -1 });

module.exports = mongoose.model('EnhancedMessage', enhancedMessageSchema);
