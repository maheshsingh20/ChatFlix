const express = require('express');
const router = express.Router();
const { getOrCreatePrivateRoom, getUserRooms, createGroupChat, getRoomMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/rooms', getUserRooms);
router.get('/rooms/private/:userId', getOrCreatePrivateRoom);
router.post('/rooms/group', createGroupChat);
router.get('/rooms/:roomId/messages', getRoomMessages);

module.exports = router;
