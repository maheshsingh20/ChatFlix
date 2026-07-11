const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on('join:room', async ({ roomId, userId }) => {
      socket.join(roomId);
      socket.userId = userId;
      socket.currentRoom = roomId;

      await User.findByIdAndUpdate(userId, { socketId: socket.id, isOnline: true });
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('leave:room', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('message:send', async ({ roomId, senderId, message }) => {
      try {
        const newMessage = await Message.create({
          chatRoom: roomId,
          sender: senderId,
          message,
          timestamp: new Date(),
        });

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'username displayName avatar');

        await ChatRoom.findByIdAndUpdate(roomId, {
          lastMessage: newMessage._id,
          lastMessageTime: new Date(),
        });

        io.to(roomId).emit('message:new', populatedMessage);
      } catch (error) {
        console.error('Message send error:', error);
      }
    });

    socket.on('typing:start', ({ roomId, userId }) => {
      socket.to(roomId).emit('user:typing', userId);
    });

    socket.on('typing:stop', ({ roomId, userId }) => {
      socket.to(roomId).emit('user:stopped-typing', userId);
    });

    socket.on('disconnect', async () => {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date(),
          socketId: null,
        });
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};

module.exports = setupSocketHandlers;
