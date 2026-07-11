const User = require('../models/User');

// @desc    Get all users (search)
// @route   GET /api/users/search?query=username
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide search query',
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
      _id: { $ne: req.user.id }, // Exclude current user
    })
      .select('username displayName avatar isOnline lastSeen')
      .limit(20);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get user contacts
// @route   GET /api/users/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('contacts', 'username displayName avatar isOnline lastSeen');

    res.status(200).json({
      success: true,
      contacts: user.contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Add contact
// @route   POST /api/users/contacts/:userId
// @access  Private
const addContact = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(req.user.id);

    if (user.contacts.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Contact already added',
      });
    }

    user.contacts.push(userId);
    await user.save();

    const contact = await User.findById(userId)
      .select('username displayName avatar isOnline lastSeen');

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { displayName, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (displayName) user.displayName = displayName;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  searchUsers,
  getContacts,
  addContact,
  updateProfile,
};
