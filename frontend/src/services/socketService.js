import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected:', this.socket.id);
          this.isConnected = true;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Socket disconnected:', reason);
          this.isConnected = false;
        });

        this.socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
        });
      } catch (error) {
        console.error('❌ Failed to initialize socket:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log('🔌 Socket disconnected manually');
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket is not connected');
    }
  }

  // Listen to events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // User login
  login(username) {
    this.emit('user:login', username);
  }

  // Send message
  sendMessage(username, message) {
    this.emit('message:send', { username, message });
  }

  // Typing indicators
  startTyping(username) {
    this.emit('typing:start', username);
  }

  stopTyping(username) {
    this.emit('typing:stop', username);
  }

  // Message status
  markAsDelivered(messageId) {
    this.emit('message:delivered', messageId);
  }

  markAsRead(messageId) {
    this.emit('message:read', messageId);
  }

  // Listen to incoming messages
  onMessageReceive(callback) {
    this.on('message:receive', callback);
  }

  // Listen to user events
  onUserJoined(callback) {
    this.on('user:joined', callback);
  }

  onUserLeft(callback) {
    this.on('user:left', callback);
  }

  onUsersOnline(callback) {
    this.on('users:online', callback);
  }

  // Listen to typing events
  onUserTyping(callback) {
    this.on('user:typing', callback);
  }

  onUserStoppedTyping(callback) {
    this.on('user:stopped-typing', callback);
  }

  // Listen to message status updates
  onMessageStatusUpdate(callback) {
    this.on('message:status-update', callback);
  }
}

export default new SocketService();
