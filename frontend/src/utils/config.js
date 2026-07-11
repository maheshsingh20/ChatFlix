// Configuration file for API and Socket URLs
// IMPORTANT: Replace with your deployed backend URL or computer's IP address
// For Render/Railway deployment: https://your-app.onrender.com
// For local testing on physical device: http://YOUR_COMPUTER_IP:3000
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://10.0.2.2:3000';

// DEPLOYMENT: Update these URLs before building APK
// Production example:
// export const API_URL = 'https://chat-backend-xyz.onrender.com';
// export const SOCKET_URL = 'https://chat-backend-xyz.onrender.com';
