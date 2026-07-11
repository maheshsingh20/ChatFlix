import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';

const socketService = {
  socket: null,
  isConnected: false,

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket'],
          reconnection: true,
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected');
          this.isConnected = true;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket error:', error);
          this.isConnected = false;
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  },

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  },

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  },

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  },
};

export default socketService;
