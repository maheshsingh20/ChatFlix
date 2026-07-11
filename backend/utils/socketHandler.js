const Message = require('../models/Message');
const User = require('../models/User');

// Store active users and their typing status
const activeUsers = new Map();
const typingUsers = new Set();

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Handle user login
    socket.on('user:login', async (username) => {
      try {
        socket.username = username;
        activeUsers.set(socket.id, username);

        // Update user in database
        await User.findOneAndUpdate(
          { username },
          {
            username,
            socketId: socket.id,
            isOnline: true,
            lastSeen: new Date(),
          },
          { upsert: true, new: true }
        );

        // Send current online users to the newly connected user
        const onlineUsers = Array.from(activeUsers.values());
        socket.emit('users:online', onlineUsers);

        // Broadcast to all clients that a new user joined
        io.emit('user:joined', { username, onlineUsers });

        console.log(`👤 User logged in: ${username}`);
      } catch (error) {
        console.error('Error during user login:', error);
        socket.emit('error', { message: 'Failed to login' });
      }
    });

    // Handle sending messages
    socket.on('message:send', async (data) => {
      try {
        const { username, message } = data;

        // Save message to database
        const newMessage = new Message({
          username,
          message,
          timestamp: new Date(),
          status: 'sent',
        });

        await newMessage.save();

        // Broadcast message to all connected clients
        io.emit('message:receive', {
          _id: newMessage._id,
          username: newMessage.username,
          message: newMessage.message,
          timestamp: newMessage.timestamp,
          status: newMessage.status,
        });

        console.log(`💬 Message from ${username}: ${message}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (username) => {
      typingUsers.add(username);
      socket.broadcast.emit('user:typing', username);
    });

    socket.on('typing:stop', (username) => {
      typingUsers.delete(username);
      socket.broadcast.emit('user:stopped-typing', username);
    });

    // Handle message status updates
    socket.on('message:delivered', async (messageId) => {
      try {
        await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
        io.emit('message:status-update', { messageId, status: 'delivered' });
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    socket.on('message:read', async (messageId) => {
      try {
        await Message.findByIdAndUpdate(messageId, { status: 'read' });
        io.emit('message:status-update', { messageId, status: 'read' });
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        const username = activeUsers.get(socket.id);

        if (username) {
          activeUsers.delete(socket.id);
          typingUsers.delete(username);

          // Update user status in database
          await User.findOneAndUpdate(
            { username },
            {
              isOnline: false,
              lastSeen: new Date(),
              socketId: null,
            }
          );

          // Broadcast to all clients that user left
          const onlineUsers = Array.from(activeUsers.values());
          io.emit('user:left', { username, onlineUsers });

          console.log(`👋 User disconnected: ${username}`);
        } else {
          console.log(`👋 User disconnected: ${socket.id}`);
        }
      } catch (error) {
        console.error('Error during disconnect:', error);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

module.exports = setupSocketHandlers;
