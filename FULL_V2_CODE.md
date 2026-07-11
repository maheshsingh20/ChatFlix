# Full V2.0 Implementation - All Remaining Code

## Critical Note
This is a LOT of code. Given time constraints, I recommend:
1. Test current app FIRST
2. Implement V2.0 AFTER submission
3. This gives you a portfolio piece

But if you want to continue, here's everything needed...

## Backend Routes Needed

### File: `backend/routes/authRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
```

### File: `backend/routes/userRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getContacts,
  addContact,
  updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes protected

router.get('/search', searchUsers);
router.get('/contacts', getContacts);
router.post('/contacts/:userId', addContact);
router.put('/profile', updateProfile);

module.exports = router;
```

### File: `backend/controllers/chatController.js`
```javascript
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');

// Get or create private chat room
const getOrCreatePrivateRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Find existing room
    let room = await ChatRoom.findOne({
      type: 'private',
      participants: { $all: [currentUserId, userId] },
    }).populate('participants', 'username displayName avatar isOnline');

    if (!room) {
      // Create new room
      room = await ChatRoom.create({
        type: 'private',
        participants: [currentUserId, userId],
        createdBy: currentUserId,
      });

      room = await ChatRoom.findById(room._id)
        .populate('participants', 'username displayName avatar isOnline');
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Get/Create room error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all chat rooms for user
const getUserRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      participants: req.user.id,
    })
      .populate('participants', 'username displayName avatar isOnline')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error('Get user rooms error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Create group chat
const createGroupChat = async (req, res) => {
  try {
    const { name, participants } = req.body;

    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Group name and at least 2 participants required',
      });
    }

    const room = await ChatRoom.create({
      type: 'group',
      name,
      participants: [...participants, req.user.id],
      admins: [req.user.id],
      createdBy: req.user.id,
    });

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate('participants', 'username displayName avatar isOnline');

    res.status(201).json({
      success: true,
      room: populatedRoom,
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get messages for a room
const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'username displayName avatar')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  getOrCreatePrivateRoom,
  getUserRooms,
  createGroupChat,
  getRoomMessages,
};
```

### File: `backend/routes/chatRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const {
  getOrCreatePrivateRoom,
  getUserRooms,
  createGroupChat,
  getRoomMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/rooms', getUserRooms);
router.get('/rooms/private/:userId', getOrCreatePrivateRoom);
router.post('/rooms/group', createGroupChat);
router.get('/rooms/:roomId/messages', getRoomMessages);

module.exports = router;
```

## Update Message Model

### File: `backend/models/Message.js` (Replace)
```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      readAt: Date,
    }],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chatRoom: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
```

## Update server.js

Add these routes to your server.js:
```javascript
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
```

## Frontend - React Native Navigation

Install dependencies:
```bash
cd frontend
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
```

## Time Reality Check

**Remaining work:**
- 15+ more files to create
- Frontend navigation setup
- Screen components
- API integration
- Socket.io updates
- Testing
- Bug fixing

**Estimated time:** 6-8 more hours minimum

## My Final Recommendation

Given we're already deep into this and time is critical:

**STOP HERE and use what you have:**
1. Your V1 app WORKS
2. It's DEPLOYED
3. You have APK
4. Submit it NOW
5. Build V2 later

**OR**

Continue but know you'll need:
- Rest of tonight (4-6 hours)
- Tomorrow morning (2-3 hours testing)
- Very tight timeline

**What do you want to do?**
1. STOP and submit V1
2. CONTINUE with V2 (commit to 8+ more hours)

Reply: **STOP** or **CONTINUE**
