# ChatFlix Backend V2.0

Node.js + Express + Socket.io + MongoDB backend for ChatFlix real-time chat application.

## Features

- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Private and group chat rooms
- ✅ Real-time messaging with Socket.io
- ✅ Message status tracking (sent/delivered/read)
- ✅ Typing indicators
- ✅ User search and contacts
- ✅ MongoDB Atlas integration
- ✅ CORS enabled
- ✅ Password hashing with bcrypt

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev
```

Server runs on `http://localhost:3000`

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=production
```

## API Endpoints

### Health Check
```
GET /health
Response: { success: true, message: "Server is running", timestamp: "..." }
```

### Authentication
```
POST /api/auth/register
Body: { username, email, password, displayName? }
Response: { success: true, token, user }

POST /api/auth/login
Body: { email, password }
Response: { success: true, token, user }
```

### Users (Protected)
```
GET /api/users/contacts
Headers: Authorization: Bearer <token>
Response: { success: true, contacts: [...] }

GET /api/users/search?query=username
Headers: Authorization: Bearer <token>
Response: { success: true, users: [...] }
```

### Chat Rooms (Protected)
```
GET /api/chats/rooms
Headers: Authorization: Bearer <token>
Response: { success: true, rooms: [...] }

GET /api/chats/rooms/private/:userId
Headers: Authorization: Bearer <token>
Response: { success: true, room }

POST /api/chats/rooms/group
Headers: Authorization: Bearer <token>
Body: { name, participantIds: [] }
Response: { success: true, room }

GET /api/chats/rooms/:roomId/messages?limit=50&skip=0
Headers: Authorization: Bearer <token>
Response: { success: true, messages: [...] }

POST /api/chats/rooms/:roomId/messages
Headers: Authorization: Bearer <token>
Body: { message }
Response: { success: true, message }
```

## Socket.io Events

### Connection
```javascript
// Client connects with JWT token
io.connect(url, {
  auth: { token: 'jwt_token_here' }
});
```

### Emit (Client → Server)
```javascript
// Join a chat room
socket.emit('join:room', { roomId, userId });

// Leave a room
socket.emit('leave:room', roomId);

// Send message
socket.emit('message:send', { roomId, senderId, message });

// Typing indicators
socket.emit('typing:start', { roomId, userId });
socket.emit('typing:stop', { roomId, userId });
```

### Listen (Server → Client)
```javascript
// New message received
socket.on('message:new', (message) => { ... });

// Typing indicators
socket.on('typing:start', ({ userId, username }) => { ... });
socket.on('typing:stop', ({ userId }) => { ... });

// User status
socket.on('user:online', (userId) => { ... });
socket.on('user:offline', (userId) => { ... });
```

## Project Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection setup
├── controllers/
│   ├── authController.js        # Login/register logic
│   ├── userController.js        # User management
│   ├── chatController.js        # Chat room logic
│   └── messageController.js     # V1 message handling (legacy)
├── middleware/
│   └── auth.js                  # JWT verification middleware
├── models/
│   ├── User.js                  # V1 User model (legacy)
│   ├── EnhancedUser.js          # V2 User with authentication
│   ├── ChatRoom.js              # Chat room model
│   ├── Message.js               # V1 Message model (legacy)
│   └── EnhancedMessage.js       # V2 Message with status
├── routes/
│   ├── authRoutes.js            # /api/auth/*
│   ├── userRoutes.js            # /api/users/*
│   ├── chatRoutes.js            # /api/chats/*
│   └── messageRoutes.js         # V1 routes (legacy)
├── utils/
│   └── socketHandler.js         # Socket.io event handlers
├── .env                         # Environment configuration
├── .env.example                 # Environment template
├── server.js                    # Application entry point
└── package.json
```

## Database Models

### EnhancedUser
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  displayName: String,
  avatar: String,
  isOnline: Boolean,
  lastSeen: Date,
  contacts: [ObjectId],
  createdAt: Date
}
```

### ChatRoom
```javascript
{
  name: String,
  type: 'private' | 'group',
  participants: [ObjectId],
  lastMessage: ObjectId,
  createdBy: ObjectId,
  createdAt: Date
}
```

### EnhancedMessage
```javascript
{
  room: ObjectId (required),
  sender: ObjectId (required),
  message: String (required),
  status: 'sent' | 'delivered' | 'read',
  timestamp: Date
}
```

## Testing

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### Test Protected Endpoint
```bash
# Replace <TOKEN> with actual JWT token from login
curl http://localhost:3000/api/users/contacts \
  -H "Authorization: Bearer <TOKEN>"
```

## Deployment

### Render (Current)
1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `PORT=3000`
6. Deploy

### Railway
1. Connect repository
2. Add MongoDB plugin
3. Set environment variables
4. Deploy automatically

### Heroku
```bash
heroku create chatflix-backend
heroku config:set MONGODB_URI=<your-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

## Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after configured time (default: 30 days)
- Protected routes require valid JWT token
- CORS configured for specific origins
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

## Performance

- Connection pooling for MongoDB
- Socket.io rooms for efficient broadcasting
- Indexed database fields (username, email, room)
- Pagination support for messages
- Efficient query patterns

## Troubleshooting

**MongoDB Connection Failed:**
- Check MONGODB_URI format
- Verify network access in MongoDB Atlas
- Ensure database user has correct permissions

**JWT Verification Failed:**
- Ensure JWT_SECRET matches between requests
- Check token expiration
- Verify Authorization header format: `Bearer <token>`

**Socket Connection Failed:**
- Check CORS configuration
- Verify Socket.io client version compatibility
- Check firewall/proxy settings

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## Dependencies

- **express**: Web framework
- **socket.io**: Real-time communication
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **nodemon**: Development auto-reload (dev)

## Scripts

```bash
npm start       # Start server (production)
npm run dev     # Start with nodemon (development)
```

## License

Open source - Available for learning purposes

---

**Version**: 2.0.0 | **Status**: ✅ Production Ready | **Deployed**: Render
