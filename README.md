# 💬 ChatFlix V2.0

A modern, full-featured real-time chat application built with React Native (Expo) and Node.js.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/maheshsingh20/ChatFlix)
[![React Native](https://img.shields.io/badge/React%20Native-0.72.6-61DAFB.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.6-010101.svg)](https://socket.io/)

## 🌟 Features

### Authentication & User Management
- ✅ Email/password authentication with JWT
- ✅ User registration and login
- ✅ Secure password hashing with bcrypt
- ✅ Persistent sessions
- ✅ User profiles with display names and avatars

### Messaging
- ✅ Real-time one-to-one private chats
- ✅ Group chat support (backend ready)
- ✅ Message delivery status (sent ✓ / delivered ✓✓ / read ✓✓)
- ✅ Typing indicators with animations
- ✅ Emoji support
- ✅ Message timestamps
- ✅ Chat history with pagination
- ✅ Auto-scroll to latest messages

### User Experience
- ✅ Dark/Light theme toggle with iOS-style colors
- ✅ Color-coded user avatars
- ✅ Online/offline status indicators
- ✅ User search by username or email
- ✅ Contact list management
- ✅ Pull-to-refresh chat list
- ✅ Unread message badges
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Expo CLI for mobile app development
- Android Studio (for Android) or Xcode (for iOS)

### Backend Setup

```bash
cd backend
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server
npm start
```

Backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install

# Start Expo development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
```

## 📱 Live Deployment

- **Backend**: [https://chatflix-sjfr.onrender.com](https://chatflix-sjfr.onrender.com)
- **Status**: ✅ Live and operational
- **Version**: 2.0.0
- **MongoDB**: Atlas Cloud Database

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React Native 0.72.6 with Expo SDK 49
- React Navigation v6 for routing
- Socket.io-client v4.6 for real-time communication
- Axios for REST API calls
- AsyncStorage for local data persistence
- Moment.js for date/time formatting

**Backend:**
- Node.js with Express.js
- Socket.io v4 for WebSocket connections
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

### Project Structure

```
ChatFlix/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User management
│   │   ├── chatController.js     # Chat room management
│   │   └── messageController.js  # Message handling (V1)
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema (V1)
│   │   ├── EnhancedUser.js       # User schema with auth (V2)
│   │   ├── ChatRoom.js           # Chat room schema
│   │   ├── Message.js            # Message schema (V1)
│   │   └── EnhancedMessage.js    # Message with status (V2)
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── chatRoutes.js         # Chat endpoints
│   │   └── messageRoutes.js      # Message endpoints (V1)
│   ├── utils/
│   │   └── socketHandler.js      # Socket.io event handlers
│   ├── .env                      # Environment variables
│   ├── server.js                 # Application entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EnhancedMessageBubble.js  # Message display with status
│   │   │   ├── TypingIndicator.js        # Typing animation
│   │   │   └── UserAvatar.js             # Color-coded avatars
│   │   ├── screens/
│   │   │   ├── AuthScreen.js             # Login/Signup
│   │   │   ├── ChatListScreen.js         # Conversation list
│   │   │   ├── ChatRoomScreen.js         # Chat interface
│   │   │   └── ContactsScreen.js         # User search & contacts
│   │   ├── services/
│   │   │   ├── apiService.js             # REST API integration
│   │   │   └── socketService.js          # Socket.io client
│   │   └── utils/
│   │       ├── config.js                 # App configuration
│   │       └── theme.js                  # Dark/Light themes
│   ├── assets/                           # Images and icons
│   ├── App.js                            # Root component
│   ├── app.json                          # Expo configuration
│   ├── eas.json                          # EAS Build configuration
│   └── package.json
│
├── DEPLOY_NOW.md                         # Deployment guide
└── README.md                             # This file
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
```

### Users
```
GET  /api/users/contacts          # Get user's contacts
GET  /api/users/search?query=     # Search users
```

### Chat Rooms
```
GET  /api/chats/rooms                    # Get user's chat rooms
GET  /api/chats/rooms/private/:userId    # Get/create private room
POST /api/chats/rooms/group              # Create group room
GET  /api/chats/rooms/:roomId/messages   # Get room messages
POST /api/chats/rooms/:roomId/messages   # Send message (REST)
```

### Health Check
```
GET  /health    # Server status
```

## 🔧 Socket.io Events

### Client → Server
```javascript
'join:room'         // Join a chat room
'leave:room'        // Leave a chat room
'message:send'      // Send a message
'typing:start'      // User started typing
'typing:stop'       // User stopped typing
```

### Server → Client
```javascript
'message:new'       // New message received
'typing:start'      // Someone is typing
'typing:stop'       // Typing stopped
'user:online'       // User came online
'user:offline'      // User went offline
```

## 🎨 Themes

### Light Mode
- Clean white/blue design
- High contrast for readability
- iOS-inspired colors

### Dark Mode
- Pure black background (#000000)
- iOS-style accent colors
- Reduced eye strain
- OLED-friendly

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=production
```

### Frontend (.env - optional)
```env
EXPO_PUBLIC_API_URL=https://chatflix-sjfr.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://chatflix-sjfr.onrender.com
```

## 📦 Building for Production

### Android APK
```bash
cd frontend
npx eas-cli@latest build --platform android --profile preview
```

### iOS IPA
```bash
cd frontend
npx eas-cli@latest build --platform ios --profile preview
```

Build takes 10-15 minutes. Download link will be provided upon completion.

## 🧪 Testing

### Backend Testing
```bash
# Health check
curl https://chatflix-sjfr.onrender.com/health

# Register user
curl -X POST https://chatflix-sjfr.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST https://chatflix-sjfr.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Frontend Testing
1. Install APK on Android device
2. Register a new account
3. Login with credentials
4. Search for other users
5. Start a conversation
6. Send messages and test real-time delivery
7. Toggle dark/light mode
8. Test typing indicators

## 🚢 Deployment

See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for detailed deployment instructions.

### Quick Deploy Steps:
1. **Backend on Render**: Connect GitHub, add environment variables, deploy
2. **Frontend APK**: Run EAS build command, wait 10-15 minutes
3. **Test**: Install APK and verify all features

## 🐛 Troubleshooting

### Backend Issues
- **Cannot connect to MongoDB**: Check MONGODB_URI format and credentials
- **JWT errors**: Ensure JWT_SECRET is set in environment variables
- **Port in use**: Change PORT in .env or kill process using port 3000

### Frontend Issues
- **Cannot connect to server**: Verify API_URL in config.js
- **Build fails**: Delete node_modules and package-lock.json, reinstall
- **Socket disconnects**: Check CORS settings on backend
- **Dependencies conflict**: Use exact versions specified in package.json

## 📝 Version History

### V2.0.0 (Current) - Complete Rewrite
- Full authentication system with JWT
- Room-based architecture (private & group chats)
- Enhanced UI with dark/light themes
- Typing indicators and message status
- User search and contacts
- Improved security and scalability

### V1.0.0 - Initial Release
- Basic real-time chat
- Simple username-based login
- Global chat room
- Message persistence

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available for learning purposes.

## 👨‍💻 Author

**Mahesh Singh**
- GitHub: [@maheshsingh20](https://github.com/maheshsingh20)
- Project: [ChatFlix](https://github.com/maheshsingh20/ChatFlix)

## 🙏 Acknowledgments

- Built with React Native and Expo
- Real-time powered by Socket.io
- Database: MongoDB Atlas
- Deployed on Render

---

**Status**: ✅ Production Ready | **Version**: 2.0.0 | **Last Updated**: July 2026
