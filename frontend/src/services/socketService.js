import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '../utils/config';

class SocketService {
  socket = null;
  isConnected = false;

  async connect() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await AsyncStorage.getItem('token');

        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          auth: {
            token: token
          }
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

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
          this.isConnected = true;
        });
      } catch (error) {
        console.error('❌ Socket initialization error:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected manually');
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      console.log(`📤 Emitting: ${event}`, data);
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Room management
  joinRoom(roomId, userId) {
    this.emit('join:room', { roomId, userId });
  }

  leaveRoom(roomId) {
    this.emit('leave:room', roomId);
  }

  sendMessage(roomId, senderId, message) {
    this.emit('message:send', { roomId, senderId, message });
  }

  // Typing indicators
  startTyping(roomId, userId) {
    this.emit('typing:start', { roomId, userId });
  }

  stopTyping(roomId, userId) {
    this.emit('typing:stop', { roomId, userId });
  }
}

export default new SocketService();
