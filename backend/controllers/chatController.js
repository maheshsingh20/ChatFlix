const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const getOrCreatePrivateRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    let room = await ChatRoom.findOne({
      type: 'private',
      participants: { $all: [req.user.id, userId] },
    }).populate('participants', 'username displayName avatar isOnline');

    if (!room) {
      room = await ChatRoom.create({
        type: 'private',
        participants: [req.user.id, userId],
        createdBy: req.user.id,
      });
      room = await ChatRoom.findById(room._id).populate('participants', 'username displayName avatar isOnline');
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getUserRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.user.id })
      .populate('participants', 'username displayName avatar isOnline')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const createGroupChat = async (req, res) => {
  try {
    const { name, participants } = req.body;
    const room = await ChatRoom.create({
      type: 'group',
      name,
      participants: [...participants, req.user.id],
      admins: [req.user.id],
      createdBy: req.user.id,
    });
    const populatedRoom = await ChatRoom.findById(room._id).populate('participants', 'username displayName avatar isOnline');
    res.status(201).json({ success: true, room: populatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'username displayName avatar')
      .sort({ timestamp: -1 })
      .limit(50);
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getOrCreatePrivateRoom, getUserRooms, createGroupChat, getRoomMessages };
