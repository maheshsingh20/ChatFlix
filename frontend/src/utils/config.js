// Configuration file for API and Socket URLs
// PRODUCTION DEPLOYMENT - Render Backend V2.0
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://chatflix-sjfr.onrender.com';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'https://chatflix-sjfr.onrender.com';

// For local testing, uncomment below and comment above:
// export const API_URL = 'http://10.0.2.2:3000'; // Android emulator
// export const SOCKET_URL = 'http://10.0.2.2:3000';

