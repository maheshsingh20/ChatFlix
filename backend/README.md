# Backend - Real-Time Chat Application

Node.js + Express + Socket.io backend for the chat application.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start MongoDB (if running locally)
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod

# Start server
npm start

# For development with auto-reload
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Messages
```
GET    /api/messages          # Get chat history
POST   /api/messages          # Send message (REST fallback)
PATCH  /api/messages/:id/status  # Update message status
```

## Socket.io Events

### Emit (Client → Server)
- `user:login` - Login with username
- `message:send` - Send new message
- `typing:start` - Start typing
- `typing:stop` - Stop typing
- `message:delivered` - Mark as delivered
- `message:read` - Mark as read

### Listen (Server → Client)
- `message:receive` - New message
- `user:joined` - User joined
- `user:left` - User left
- `users:online` - Online users list
- `user:typing` - User is typing
- `user:stopped-typing` - User stopped typing
- `message:status-update` - Status changed

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chatapp
NODE_ENV=development
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── messageController.js # Business logic
├── models/
│   ├── Message.js          # Message schema
│   └── User.js             # User schema
├── routes/
│   └── messageRoutes.js    # REST routes
├── utils/
│   └── socketHandler.js    # Socket.io handlers
└── server.js               # Entry point
```

## Testing

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test get messages
curl http://localhost:3000/api/messages

# Test send message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"username":"test","message":"Hello!"}'
```

## Deployment

### Render
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### Railway
1. Connect GitHub repository
2. Add MongoDB plugin
3. Set environment variables
4. Deploy

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in .env
- Check network connectivity (if using Atlas)

**Port Already in Use:**
- Change PORT in .env
- Or kill the process using the port

**Socket Connection Failed:**
- Check CORS settings
- Verify Socket.io client version compatibility
- Check firewall settings
