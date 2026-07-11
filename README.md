# 💬 Real-Time Chat Application

A modern real-time chat application built with React Native (frontend) and Node.js + Express + Socket.io (backend).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)
- [Bonus Features Implemented](#bonus-features-implemented)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

## ✨ Features

### Core Features
- ✅ **Real-time messaging** using Socket.io
- ✅ **Send and receive messages** instantly without page refresh
- ✅ **Chat history** persists after refresh
- ✅ **Message timestamps** displayed in a readable format
- ✅ **Clean and user-friendly** interface
- ✅ **REST APIs** for sending messages and fetching chat history

### Bonus Features
- ✅ **Username-based login** (dummy authentication)
- ✅ **Typing indicator** - see when someone is typing
- ✅ **Online/offline user status** - see who's currently online
- ✅ **Message read/delivered status** - track message delivery
- ✅ **MongoDB integration** - persistent message storage
- ✅ **Graceful error handling** for API and Socket errors

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo
- **Socket.io-client** for real-time communication
- **Axios** for REST API calls
- **AsyncStorage** for local data persistence
- **Moment.js** for timestamp formatting

### Backend
- **Node.js** with Express
- **Socket.io** for real-time bidirectional communication
- **MongoDB** with Mongoose for database
- **dotenv** for environment configuration
- **CORS** for cross-origin requests

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── messageController.js # Message business logic
│   ├── models/
│   │   ├── Message.js           # Message schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   └── messageRoutes.js     # REST API routes
│   ├── utils/
│   │   └── socketHandler.js     # Socket.io event handlers
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MessageBubble.js    # Message display component
│   │   │   └── TypingIndicator.js  # Typing animation
│   │   ├── screens/
│   │   │   ├── LoginScreen.js      # Login UI
│   │   │   └── ChatScreen.js       # Main chat UI
│   │   ├── services/
│   │   │   ├── apiService.js       # REST API calls
│   │   │   └── socketService.js    # Socket.io client
│   │   └── utils/
│   │       └── config.js           # App configuration
│   ├── App.js                   # Root component
│   ├── app.json                 # Expo configuration
│   ├── package.json
│   └── babel.config.js
│
└── README.md                    # This file
```

## 📦 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Expo CLI** - For React Native development
- **Android Studio** or **Xcode** - For mobile emulator (optional)
- **Physical Device** - Android or iOS (optional)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env file with your MongoDB URI (if using MongoDB Atlas or custom URI)
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/chatapp
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Create .env file (optional, uses localhost by default)
copy .env.example .env
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # Mac/Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file

## 🏃 Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend

# Start the server
npm start

# OR for development with auto-reload
npm run dev
```

The backend server will start on `http://localhost:3000`

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on port 3000
📡 Socket.io is ready for connections
```

### Start Frontend Application

**For Android Emulator:**

```bash
# From frontend directory
cd frontend

# Start Expo
npm start

# Press 'a' to open Android emulator
```

**For Physical Device:**

1. Install **Expo Go** app from Play Store (Android) or App Store (iOS)
2. Start the development server:
   ```bash
   npm start
   ```
3. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

**Important for Physical Devices:**
- Make sure your device and computer are on the same network
- Update `src/utils/config.js` with your computer's IP address:
  ```javascript
  export const API_URL = 'http://YOUR_IP_ADDRESS:3000';
  export const SOCKET_URL = 'http://YOUR_IP_ADDRESS:3000';
  ```
- Find your IP address:
  - Windows: `ipconfig` (look for IPv4 Address)
  - Mac/Linux: `ifconfig` or `ip addr`

**For Web:**

```bash
npm start
# Press 'w' to open in browser
```

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chatapp
NODE_ENV=development
```

### Frontend (.env) - Optional

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

**Note:** For Android emulator, use `http://10.0.2.2:3000` instead of `localhost`

## 📡 API Documentation

### REST Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Get Chat History
```http
GET /api/messages?limit=50&skip=0
```

**Query Parameters:**
- `limit` (optional): Number of messages to fetch (default: 50)
- `skip` (optional): Number of messages to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "message_id",
      "username": "john",
      "message": "Hello!",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "status": "read"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "skip": 0
  }
}
```

#### 3. Send Message (REST fallback)
```http
POST /api/messages
Content-Type: application/json

{
  "username": "john",
  "message": "Hello, everyone!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "username": "john",
    "message": "Hello, everyone!",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "sent"
  }
}
```

#### 4. Update Message Status
```http
PATCH /api/messages/:messageId/status
Content-Type: application/json

{
  "status": "read"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "status": "read"
  }
}
```

### Socket.io Events

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `user:login` | `username` (string) | Login with username |
| `message:send` | `{ username, message }` | Send a new message |
| `typing:start` | `username` (string) | User started typing |
| `typing:stop` | `username` (string) | User stopped typing |
| `message:delivered` | `messageId` (string) | Mark message as delivered |
| `message:read` | `messageId` (string) | Mark message as read |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message:receive` | `{ _id, username, message, timestamp, status }` | New message received |
| `user:joined` | `{ username, onlineUsers[] }` | User joined chat |
| `user:left` | `{ username, onlineUsers[] }` | User left chat |
| `users:online` | `onlineUsers[]` | Current online users |
| `user:typing` | `username` (string) | User is typing |
| `user:stopped-typing` | `username` (string) | User stopped typing |
| `message:status-update` | `{ messageId, status }` | Message status changed |

## 🎨 Design Decisions

### 1. **Architecture Pattern**
- **Clean Architecture**: Separated concerns into controllers, models, routes, and utilities
- **Service Layer**: Frontend uses dedicated service files for API and Socket communication
- **Component-Based UI**: Reusable React Native components for better maintainability

### 2. **Real-Time Communication**
- **Socket.io**: Chosen for its reliability, automatic reconnection, and broad browser support
- **Event-Driven**: All real-time features use Socket.io events for instant updates
- **REST API Fallback**: REST endpoints available as backup for message sending

### 3. **Data Persistence**
- **MongoDB**: NoSQL database chosen for flexible schema and scalability
- **Mongoose ODM**: Provides schema validation and easier database operations
- **Message Indexing**: Timestamp indexed for faster query performance

### 4. **State Management**
- **React Hooks**: useState and useEffect for local state management
- **AsyncStorage**: Persistent username storage for auto-login
- **No Redux**: Kept simple due to small app scope

### 5. **Error Handling**
- **Try-Catch Blocks**: All async operations wrapped in error handlers
- **User Feedback**: Alerts and console logs for debugging
- **Graceful Degradation**: App continues working even if some features fail

### 6. **UI/UX Design**
- **WhatsApp-inspired**: Familiar bubble-style chat interface
- **Material Design**: Clean, modern aesthetic with proper elevation and shadows
- **Responsive**: Works on different screen sizes
- **Accessibility**: Proper contrast ratios and touch targets

## 📝 Assumptions

1. **Authentication**: Implemented as dummy username-based login (no password or OAuth)
2. **Single Chat Room**: All users share one global chat room (no private channels)
3. **Message History**: Limited to last 50 messages by default (configurable)
4. **Network**: Assumes stable internet connection for real-time features
5. **MongoDB**: Assumes MongoDB is running locally or connection string is provided
6. **Expo**: Frontend uses Expo for simplified React Native development
7. **Username Uniqueness**: System allows duplicate usernames (could be enhanced)
8. **Data Retention**: Messages stored permanently (could add auto-cleanup)

## 🎁 Bonus Features Implemented

- ✅ **Username-based Login**: Simple authentication with AsyncStorage persistence
- ✅ **Typing Indicator**: Animated dots when users are typing
- ✅ **Online/Offline Status**: Real-time user presence tracking
- ✅ **Message Status**: Sent/Delivered/Read indicators
- ✅ **MongoDB Integration**: Persistent message and user storage
- ✅ **Auto-Reconnect**: Socket.io automatically reconnects on disconnect
- ✅ **Chat History**: Previous messages loaded on app start
- ✅ **Timestamps**: Human-readable message times
- ✅ **User Count**: Display number of online users

## 🚀 Deployment

### Backend Deployment (Render/Railway)

**Using Render:**

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create New → Web Service
4. Connect your repository
5. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add Environment Variables (PORT, MONGODB_URI)
6. Deploy

**Using Railway:**

1. Push code to GitHub
2. Go to [Railway](https://railway.app/)
3. New Project → Deploy from GitHub
4. Select your repository
5. Add MongoDB service
6. Add environment variables
7. Deploy

### MongoDB Atlas Setup

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Update `MONGODB_URI` environment variable

### Frontend Deployment

**Building APK:**

```bash
cd frontend

# Build for Android
expo build:android

# OR using EAS Build (recommended)
npm install -g eas-cli
eas build --platform android
```

**Web Deployment:**

```bash
# Build for web
expo build:web

# Deploy to Netlify/Vercel
```

## 📱 Testing the Application

### Manual Testing Checklist

1. **Login Flow**
   - [ ] Enter username and login
   - [ ] Username persists after app reload

2. **Messaging**
   - [ ] Send a message
   - [ ] Receive messages from other users
   - [ ] Messages appear instantly
   - [ ] Timestamps are correct

3. **Real-Time Features**
   - [ ] Typing indicator shows when someone types
   - [ ] Online users count updates
   - [ ] User join/leave notifications

4. **Persistence**
   - [ ] Close and reopen app - messages should persist
   - [ ] Refresh page - chat history loads

5. **Error Handling**
   - [ ] Try with server offline - graceful error
   - [ ] Send empty message - validation works

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
# Windows:
sc query MongoDB

# Mac/Linux:
sudo systemctl status mongod
```

**Port Already in Use:**
```bash
# Change PORT in .env file or kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Frontend Issues

**Cannot Connect to Server:**
- Update `src/utils/config.js` with correct IP/URL
- For Android emulator: use `http://10.0.2.2:3000`
- For physical device: use computer's IP address
- Check if backend server is running

**Expo Start Failed:**
```bash
# Clear Expo cache
expo start -c

# Clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created as part of a technical assessment for a real-time chat application.

## 🙏 Acknowledgments

- Socket.io documentation
- React Native community
- Expo framework
- MongoDB documentation

---

**Note**: This README provides comprehensive setup and usage instructions. For any issues or questions, please refer to the troubleshooting section or check the respective technology documentation.
